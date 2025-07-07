import { exoprtAssetsFunc } from "../../lib/utils/exportAssetsFunc";

const images = import.meta.glob('./*.png', {eager: true}) as Record<string, {default: string}>

export const items = exoprtAssetsFunc({ images, ext: "png" });