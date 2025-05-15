import { Goal } from "@/types/goal";
import { format, isValid } from 'date-fns';

/**
 * Calculates the number of days remaining until the goal's target date.
 * @param goal - The goal object with a `target` date.
 * @returns Number of days remaining or null if invalid.
 */
export const daysRemaining = (goal: Goal): number | null => {
    try {
        if (!goal?.target) throw new Error("Missing goal target date");

        const targetDate = new Date(goal.target);
        if (!isValid(targetDate)) throw new Error("Invalid target date format");

        const today = new Date();
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    } catch (error) {
        console.error("Error in daysRemaining:", (error as Error).message);
        return null;
    }
};

/**
 * Formats the goal's target date into a readable string.
 * @param goal - The goal object with a `target` date.
 * @returns A formatted date string or 'Invalid date' if error occurs.
 */
export const formDateTime = (goal: Goal): string => {
    try {
        if (!goal?.target) throw new Error("Missing goal target date");

        const targetDate = new Date(goal.target);
        if (!isValid(targetDate)) throw new Error("Invalid target date format");

        return format(targetDate, 'MMM d, yyyy');
    } catch (error) {
        console.error("Error in formDateTime:", (error as Error).message);
        return "Invalid date";
    }
};
