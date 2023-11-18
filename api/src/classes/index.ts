// Schedule classes
export { default as Schedule, type Period } from "@/classes/schedule";
export { default as Lesson } from "@/classes/schedule/lesson";

// Bakalari classes
export {
    AbsenceLesson,
    BakalariLesson,
    BakalariLessonType,
    NormalLesson,
    RemovedLesson,
    type AnyBakalariLesson,
    type Group
} from "@/classes/bakalari";

// SSSVT classes
export { default as SSSVT, type SSSVTClass } from "@/classes/sssvt";
export { LessonCancellation, LessonChange, LessonChangeType, LessonSubstitution, type AnyLessonChange } from "@/classes/sssvt/change";

// Detail classes
export { Detail, DetailHandler, DetailType, TeacherDetail, type AnyDetail } from "@/classes/details";
