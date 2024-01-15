import { ProgressColors } from "../Components/Home/BudgetWidget/ProgressBar/progress-bar-colors";
import Budget from "../Models/Budget";

// stolen from the web 🏄🏻‍♂️
export function formatDate(date: Date): string
{
    return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear()
}

export function daysBetween(from: Date, to: Date): number
{
    return (to.getTime() - from.getTime()) / (1000 * 3600 * 24);
}

export function getProgressBarColor(budget: Budget): ProgressColors
{
    let pctValue = budget.calculatePctValue()
    if (pctValue >= 100) {
        return ProgressColors.Error;
    }
    else if (pctValue >= 75) {
        return ProgressColors.Warning;
    }

    return ProgressColors.Valid;
}

export function easeInOutInterp(start: number, end: number, progression: number)
{
    // Apply easing using sine function
    const easedProgression = 0.5 - 0.5 * Math.cos(Math.PI * progression);

    // Interpolate between start and end using eased progression
    return start + (end - start) * easedProgression;
}