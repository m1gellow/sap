import { exoprtAssetsFunc } from "../../lib/utils/exportAssetsFunc";

const images = import.meta.glob('./*.svg', {eager: true}) as Record<string, {default: string}>

export const patterns = exoprtAssetsFunc({ images, ext: "svg" });