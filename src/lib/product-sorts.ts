export type SortKey = "default" | "price-asc" | "price-desc" | "rise" | "fall";

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "default", label: "ডিফল্ট" },
  { key: "price-asc", label: "দাম: কম থেকে বেশি" },
  { key: "price-desc", label: "দাম: বেশি থেকে কম" },
  { key: "rise", label: "সবচেয়ে বেশি বেড়েছে" },
  { key: "fall", label: "সবচেয়ে বেশি কমেছে" },
];
