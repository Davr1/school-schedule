import { AbsenceLesson } from "@/classes/bakalari/lesson";
import type { BakalariData } from "@/parser/bakalari/data";

/**
 * Parse a class absence from a node
 *
 * @param data The data attribute of the node
 * @returns The parsed lesson
 */
function parseAbsence(data: BakalariData): AbsenceLesson {
    // Get the fields
    const name = data.InfoAbsentName!;
    const abbreviation = data.absentinfo!;
    const change = data.removedinfo!;

    return new AbsenceLesson({ name, abbreviation }, change);
}

export default parseAbsence;
