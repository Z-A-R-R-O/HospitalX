import type { Metadata } from "next";
import DownloadPage from "@/components/interfrozt/DownloadPage";
export const metadata: Metadata = {
  title: "Download HospitalX — Veyminore Edition",
  description: "Install HospitalX as an app or open the connected hospital operating system in your browser.",
};
export default function HospitalXDownloadPage() {
  return <DownloadPage />;
}
