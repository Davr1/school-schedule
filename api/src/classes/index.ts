// Schedule classes
export { default as Schedule } from "@/classes/schedule";
export { Group } from "@/classes/schedule/group";
export { BaseLesson, ConflictLesson, LessonType, NormalLesson, RemovedLesson, type AnyLesson } from "@/classes/schedule/lesson";

// Bakalari classes
export {
    AbsenceBakalariLesson,
    BakalariAbsenceType,
    BakalariLessonType,
    BaseBakalariLesson,
    NormalBakalariLesson,
    RemovedBakalariLesson,
    type AnyBakalariLesson
} from "@/classes/bakalari";

// SSSVT classes
export { BaseSSSVTChange, SSSVTCancellation, SSSVTChangeType, SSSVTSubstitution, type AnySSSVTChange } from "@/classes/sssvt/change";
export { default as SSSVT, type SSSVTClass } from "@/classes/sssvt/schedule";

// Detail classes
export { Detail, DetailHandler, DetailType, TeacherDetail, type AnyDetail } from "@/classes/details";
