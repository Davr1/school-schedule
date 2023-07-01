import { writable } from "svelte/store";

export type ModalType = "AdvancedSettingsModal" | "SubjectInfoModal";

interface Modal {
    type: "" | ModalType;
    context: any; // TODO: I have no clue what tf is going on here. So I'm just gonna leave it as any
    visible: boolean;
}

export const modal = writable<Modal>({ type: "", context: {}, visible: false });
