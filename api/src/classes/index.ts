// Schedule classes
export { default as Schedule, type Period, type ScheduleJSON } from "@/classes/schedule";
export { default as Lesson } from "@/classes/schedule/lesson";

// Bakalari classes
export {
    AbsenceLesson,
    BakalariLesson,
    BakalariLessonType,
    NormalLesson,
    RemovedLesson,
    type AnyBakalariLesson,
    type BakalariLessonJSON,
    type Group
} from "@/classes/bakalari";

// SSSVT classes
export { default as SSSVT, type SSSVTClass } from "@/classes/sssvt";
export {
    LessonCancellation,
    LessonChange,
    LessonChangeType,
    LessonSubstitution,
    type AnyLessonChange,
    type LessonChangeJSON
} from "@/classes/sssvt/change";

// Detail classes
export { Detail, DetailHandler, DetailType, TeacherDetail, type AnyDetail, type DetailJSON } from "@/classes/details";
