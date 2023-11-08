import { type AnyNode, isTag } from "domhandler";

import { AbsenceLesson, type BakalariLesson, BakalariLessonType, DetailHandler, RemovedLesson } from "@/classes";
import BakalariNormalLessonParser from "@/parser/bakalari/normalLesson";

export interface BakalariData {
    type: BakalariLessonType;
    subjecttext: string;
    teacher: string | null;
    room: string;
    group: string;
    theme: string;
    notice: string;
    changeinfo: string;
    homeworks: unknown;
    absencetext: unknown;
    hasAbsent: boolean;
    absentinfo: string | null;
    absentInfoText: string;
    removedinfo: string | null;
    InfoAbsentName: string | null;
}

class BakalariLessonParser {
    private normalLessonParser: BakalariNormalLessonParser;

    constructor(details: DetailHandler) {
        this.normalLessonParser = new BakalariNormalLessonParser(details);
    }

    /**
     * Parse the lesson from the given node
     *
     * @param node The node to parse
     * @returns The parsed lesson
     */
    parse(node: AnyNode): BakalariLesson {
        // Make sure the node is an element
        if (!isTag(node)) throw new Error("Node is not an element");

        // Get the data attribute from the node
        const data = JSON.parse(node.attribs["data-detail"]) as BakalariData;

        switch (data.type) {
            case BakalariLessonType.Normal:
                // I separated this into a separate file because it's a bit long
                return this.normalLessonParser.parse(node, data);
            case BakalariLessonType.Removed:
                return this.removed(data);
            case BakalariLessonType.Absence:
                return this.absence(data);
            default:
                throw new Error(`Unknown lesson type: ${data.type}`);
        }
    }

    /** Parse a removed lesson from a node */
    private removed(data: BakalariData): RemovedLesson {
        // Just return the info about the removal...
        return new RemovedLesson(data.removedinfo!);
    }

    /** Parse an absence from a node */
    private absence(data: BakalariData): AbsenceLesson {
        // Get the fields
        const name = data.InfoAbsentName!;
        const abbreviation = data.absentinfo!;
        const change = data.removedinfo!;

        return new AbsenceLesson(change, { name, abbreviation });
    }
}

export default BakalariLessonParser;
