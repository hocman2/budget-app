// A script that controls how background ellipses should be positionned

import { easeInOutInterp } from "./utils";

type Position = {
    x: number,
    y: number
}

export type ElementsInfo = {
    greenEllipse: Element,
    purpleEllipse: Element,
    container: HTMLElement,
}

export type AnimInfo = {
    /// Angle in degrees expressing how the ellipses are rotated using the center as pivot
    toAngle: number|undefined,
    /// Distance from the center in px which the ellipse should be
    toDistance: number|undefined,
    timeSecs: number,
}

let currentDistance: number = 500;
let currentRotation: number = 45;

function findShortestPath(from:number, to: number): number
{
   // Find the shortest path for destinationAngle
    // Explanation here: https://math.stackexchange.com/a/2898118
    const alpha = to - from;
    const beta = alpha + 360;
    const gamma = alpha - 360;

    const absValues = [Math.abs(alpha), Math.abs(beta), Math.abs(gamma)];
    const minAbs = Math.min(...absValues);
    const index = absValues.indexOf(minAbs);

    // 🤮
    return (index === 0) ? from + alpha : (index === 1) ? from + beta : from + gamma;
}

export function rotateEllipses(elementsInfo: ElementsInfo, animInfo: AnimInfo) 
{
    // Assuming fps is 60
    const numUpdates = animInfo.timeSecs * 60;
    let currentNumUpdate = 0;

    let startAngle = currentRotation;
    let startDistance = currentDistance;

    let destinationAngle = (animInfo.toAngle === undefined) ? startAngle : animInfo.toAngle;
    let destinationDistance = (animInfo.toDistance === undefined) ? startDistance : animInfo.toDistance;

    destinationAngle = findShortestPath(startAngle, destinationAngle);

    let rotate = () => {
        ++currentNumUpdate;

        currentRotation = easeInOutInterp(startAngle, destinationAngle, currentNumUpdate / numUpdates);
        currentDistance = easeInOutInterp(startDistance, destinationDistance, currentNumUpdate / numUpdates);
        
        performRotation(elementsInfo);
        
        // Stop anim
        if (currentNumUpdate >= numUpdates)
        {
            // Angle clamped back to 0-360 range
            if (currentRotation < 0) currentRotation += 360;
            else if (currentRotation > 360) currentRotation -= 360;

            return;
        }

        requestAnimationFrame(rotate);
    };

    rotate();
}

function performRotation(ei: ElementsInfo)
{
    const interactibleAreaRect = ei.container.getBoundingClientRect();
    // We want to center the pivot on the interactible area
    const pivot: Position = {
        x: interactibleAreaRect.x + interactibleAreaRect.width / 2,
        y: interactibleAreaRect.y + interactibleAreaRect.height / 2,
    };

    let theta = currentRotation * Math.PI / 180.0;
    let greenPos: Position = {x: Math.cos(theta) * currentDistance, y: Math.sin(theta) * currentDistance};

    let hw = ei.greenEllipse.getBoundingClientRect().width / 2.0;
    let hh = ei.greenEllipse.getBoundingClientRect().height / 2.0;
    ei.greenEllipse.setAttribute("style", `left: ${pivot.x - greenPos.x - hw}px; top: ${pivot.y - greenPos.y - hh}px`);

    let purplePos: Position = {x: Math.cos(theta) * currentDistance, y: Math.sin(theta) * currentDistance};    
    hw = ei.purpleEllipse.getBoundingClientRect().width / 2.0;
    hh = ei.purpleEllipse.getBoundingClientRect().height / 2.0;
    ei.purpleEllipse.setAttribute("style", `left: ${pivot.x + greenPos.x - hw}px; top: ${pivot.y + greenPos.y - hh}px`);
}