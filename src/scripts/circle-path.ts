export type Arc = {
    /**
     *  Angle between 0 and 2PI (counter-clockwise) at which the arc starts 
     */
    offsetAngle: number,
    /**
     * Angle between 0 and 2PI that determines the angle of the arc 
     */
    sweepAngle: number
};

/**
 * @param viewboxSize The width and height of a square svg viewbox in which the arc will be drawn
 * @param radius The radius of the circle for the desired arc
 * @returns A path command string that draws the specified arc
 */
export function computeCircleArc(viewboxSize: number, radius: number, arc: Arc): string
{
    let start = arc.offsetAngle, sweep = arc.sweepAngle;
    // There is an issue when drawing arcs of more than 180° so we split the arc in two parts < 180°
    // and call this function recursively
    if (sweep > Math.PI)
    {
        let segmentationAngle = sweep - Math.PI;
        return `${computeCircleArc(viewboxSize, radius, {offsetAngle: start, sweepAngle:segmentationAngle})} ${computeCircleArc(viewboxSize, radius, {offsetAngle:start + segmentationAngle, sweepAngle: sweep - segmentationAngle})}`;
    }

    type Point = { x: number, y: number };

    // Calculate the location of the start and end point from the center of the viewbox
    let center = viewboxSize / 2;
    let pathStart: Point = {
        x: center + Math.cos(start) * radius,
        y: center - Math.sin(start) * radius
    };
    let pathEnd: Point = {
        x: center + Math.cos(start + sweep) * radius,
        y: center - Math.sin(start + sweep) * radius,
    };

    return `M${pathStart.x}, ${pathStart.y}A${radius},${radius} 0 0,0 ${pathEnd.x},${pathEnd.y}`;
}