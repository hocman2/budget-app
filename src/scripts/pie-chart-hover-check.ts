import { type Arc } from "./circle-path";

/**
 * An SVG element supposed to represent a circle section
 * The arc defined by this svg must be passed
 */
export type SVGArc = {
    svg: SVGSVGElement,
    arc: Arc
};

export type SectionHoveredEvent = {
    svg: SVGSVGElement,
    index: number,
}

/**
 * An object that continuously checks if the mouse position hovers a circle arc.
 * The object starts checking for intersection when the mouse enters one of the passed-in SVGArc
 */
export default class PieChartHoverCheck
{
    private hoverCheck = false;
    private svgsArcs: Array<SVGArc> = [];
    private radius = 1;
    private strokeWidth = 1;
    private mousePos: {x:number, y:number} = {x:0, y:0};
    private hoverCallback: ((_:SectionHoveredEvent) => void)|undefined = undefined;
    private stopHoverCallbackx: ((_:SectionHoveredEvent) => void)|undefined = undefined;
    private currentlyHovered: number = -1;

    constructor(radius: number, strokeWidth: number, svgs: Array<SVGArc> = [])
    {
        if (svgs.length > 0)
        {
            this.svgsArcs = [...svgs];
        }

        this.radius = radius;
        this.strokeWidth = strokeWidth;

        window.addEventListener("mousemove", (evt) => { this.mousePos = {x: evt.clientX, y: evt.clientY}; });
    }

    addSvg(svgarc: SVGArc)
    {
        svgarc.svg.addEventListener("mouseenter", () => { this.startHoverCheck(); });
        svgarc.svg.addEventListener("mouseleave", () => { this.stopHoverCheck(); });
        this.svgsArcs.push(svgarc);
    }

    clear()
    {
        this.svgsArcs = [];
    }
    
    startHoverCheck()
    {
        if (this.svgsArcs.length === 0) return;

        this.hoverCheck = true;
        
        // Calculate the amount by which we should scale the stroke and radius of each svg
        let firstSvg = this.svgsArcs[0].svg;
        let scaleRatio = 1;
        if (firstSvg.parentElement)
        {
            scaleRatio = firstSvg.parentElement.getBoundingClientRect().width / firstSvg.viewBox.baseVal.width;
        }

        requestAnimationFrame(() => { this.mouseInChart(this.radius * scaleRatio, this.strokeWidth * scaleRatio / 2); });
    }
    stopHoverCheck()
    {
        this.hoverCheck = false;
    }

    /**
     * A callback to be invoked whenever the mouse overlaps a circle section
     */
    onSectionHovered(callback: (_: SectionHoveredEvent) => void)
    {
        this.hoverCallback = callback;
    }
    /**
     * A callback to be invoked whenever the mouse stops overlapping or changes overlapped section
     * The parameter of this function contain information about the previously hovered element
     */
    onSectionStopHover(callback: (_:SectionHoveredEvent) => void)
    {
        this.stopHoverCallbackx = callback;
    }

    private mouseInChart(radius: number, halfStroke: number)
    {
        // Break the loop
        if (!this.hoverCheck || this.svgsArcs.length === 0) return;

        // Get the cursor's position relative to the center of the svg
        // x pointing right, y pointing up, center 0
        let svgRect = this.svgsArcs[0].svg.getBoundingClientRect();
        let mouseX = -(svgRect.left + svgRect.width / 2 - this.mousePos.x);
        let mouseY = svgRect.top + svgRect.height / 2 - this.mousePos.y;

        // From that we can determine the angle on the unit circle
        let angle = Math.atan2(mouseY, mouseX);
        // From -PI -> PI range to 0 -> 2PI range
        if (angle < 0) angle += Math.PI * 2;

        // The stroke is supposed to be evenly applied so we calculate the valid x and y ranges
        let yUnit = Math.sin(angle);
        let yStart = yUnit * (radius - halfStroke); let yEnd = yUnit * (radius + halfStroke);
        let xUnit = Math.cos(angle);
        let xStart = xUnit * (radius - halfStroke); let xEnd = xUnit * (radius + halfStroke);

        let inRange = (start:number, value:number, end:number): boolean => {
            let absVal = Math.abs(value);
            return absVal >= Math.abs(start) && absVal <= Math.abs(end);
        };

        // Determine if the cursor is in the stroked-area of the circle
        let mouseIn: boolean = inRange(xStart, mouseX, xEnd) || inRange(yStart, mouseY, yEnd);

        // Iterate through all our svgs and try to find an overlapped arc
        let noOverlap = true;
        for (let [i, svgArc] of this.svgsArcs.entries())
        {
            let svg = svgArc.svg, arc = svgArc.arc;
            
            let mouseInAngle: boolean = mouseIn && inRange(arc.offsetAngle, angle, arc.offsetAngle + arc.sweepAngle);

            if (mouseInAngle)
            {
                // Call eventual hover callback
                if (i !== this.currentlyHovered)
                {
                    // Call an eventual stop hover callback
                    if (this.currentlyHovered >= 0)
                    {
                        this.stopHoverCallbackx?.({
                                svg: this.svgsArcs[this.currentlyHovered].svg,
                                index:this.currentlyHovered
                        });
                    }
    
                    this.currentlyHovered = i;
                    this.hoverCallback?.({svg: svg, index: i});
                }

                noOverlap = false;
                break;
            }
        }

        // If there was a hovered element that is no longer hovered (no overlap)
        // we'll invoke this callback
        if (this.currentlyHovered >= 0 && noOverlap)
        {
            this.stopHoverCallbackx?.({
                svg: this.svgsArcs[this.currentlyHovered].svg,
                index:this.currentlyHovered
            });
            this.currentlyHovered = -1;
        }
    
        requestAnimationFrame(() => { this.mouseInChart(radius, halfStroke); });
    }
};
