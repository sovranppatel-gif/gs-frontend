import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import {
  addHeroLeft,
  deleteHeroLeft,
  editHeroLeft,
  flipHeroLeftPublish,
  flipHeroLeftVisibility,
  loadHeroLeftList,
} from "../../../redux/heroLeft/heroLeftSlice.js";
import { uploadHeroLeftAvatar } from "../../../services/heroLeftService.js";
import { API_URL } from "../../../utils/api.js";

function padThreeAvatarSlots(urls) {
  const a = Array.isArray(urls) ? urls.map((u) => String(u || "").trim()) : [];
  return [a[0] || "", a[1] || "", a[2] || ""];
}

function resolveHeroAssetPreview(path) {
  if (!path) return "";
  const p = String(path).trim();
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return `${API_URL}${p.startsWith("/") ? "" : "/"}${p}`;
}

const defaultValues = {
  sectionLabel: "",
  badgeLabel: "",
  headlineLine1: "",
  headlineLine2: "",
  bodyParagraph1: "",
  highlightPhrase: "",
  bodyParagraph2: "",
  bulletPoints: [{ point: "" }],
  primaryCtaLabel: "",
  primaryCtaHref: "#top",
  secondaryCtaLabel: "",
  secondaryCtaPath: "#top",
  socialProofText: "",
  socialProofAvatarUrls: ["", "", ""],
  isVisible: true,
  publishStatus: "draft",
  displayOrder: 1,
};

function rowToForm(row) {
  const pts = row.bulletPoints?.length
    ? row.bulletPoints.map((p) => ({ point: p || "" }))
    : [{ point: "" }];
  return {
    sectionLabel: row.sectionLabel || "",
    badgeLabel: row.badgeLabel || "",
    headlineLine1: row.headlineLine1 || "",
    headlineLine2: row.headlineLine2 || "",
    bodyParagraph1: row.bodyParagraph1 || "",
    highlightPhrase: row.highlightPhrase || "",
    bodyParagraph2: row.bodyParagraph2 || "",
    bulletPoints: pts,
    primaryCtaLabel: row.primaryCtaLabel || "",
    primaryCtaHref: row.primaryCtaHref || "#top",
    secondaryCtaLabel: row.secondaryCtaLabel || "",
    secondaryCtaPath: row.secondaryCtaPath || "#top",
    socialProofText: row.socialProofText || "",
    socialProofAvatarUrls: padThreeAvatarSlots(row.socialProofAvatarUrls),
    isVisible: row.isVisible ?? true,
    publishStatus: row.publishStatus || "draft",
    displayOrder: row.displayOrder ?? 1,
  };
}

export default function HeroLeftCmsManager() {
  const dispatch = useDispatch();
  const { rows, pagination, loading, error, mutationLoading } = useSelector((state) => state.heroLeft);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploadingSlot, setUploadingSlot] = useState(null);

  const { register, handleSubmit, control, reset, setValue, watch } = useForm({ defaultValues });
  const avatarSlots = watch("socialProofAvatarUrls") || ["", "", ""];
  const { fields, append, remove } = useFieldArray({ control, name: "bulletPoints" });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      dispatch(loadHeroLeftList({ page, limit: 10, search }));
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [dispatch, page, search]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const activeRows = useMemo(() => rows || [], [rows]);

  const refetch = async () => {
    await dispatch(loadHeroLeftList({ page, limit: 10, search })).unwrap();
  };

  const onAvatarFile = async (slotIndex, file) => {
    setUploadingSlot(slotIndex);
    try {
      const url = await uploadHeroLeftAvatar(file);
      setValue(`socialProofAvatarUrls.${slotIndex}`, url);
      setToast({ type: "success", message: "Image uploaded" });
    } catch (err) {
      setToast({ type: "error", message: err?.message || "Upload failed" });
    } finally {
      setUploadingSlot(null);
    }
  };

  const onSubmit = async (values) => {
    const bulletPoints = (values.bulletPoints || [])
      .map((b) => String(b?.point || "").trim())
      .filter(Boolean);
    const socialProofAvatarUrls = [0, 1, 2]
      .map((i) => String(values.socialProofAvatarUrls?.[i] || "").trim())
      .filter(Boolean)
      .slice(0, 3);
    const payload = {
      ...values,
      bulletPoints,
      socialProofAvatarUrls,
    };
    try {
      if (editingRow?._id) {
        await dispatch(editHeroLeft({ id: editingRow._id, payload })).unwrap();
        setToast({ type: "success", message: "Hero left section updated" });
      } else {
        await dispatch(addHeroLeft(payload)).unwrap();
        setToast({ type: "success", message: "Hero left section created" });
      }
      setIsModalOpen(false);
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to save hero left section" });
    }
  };

  const toggleVisibility = async (row) => {
    try {
      await dispatch(flipHeroLeftVisibility(row._id)).unwrap();
      setToast({ type: "success", message: "Visibility updated" });
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to toggle visibility" });
    }
  };

  const togglePublish = async (row) => {
    try {
      await dispatch(flipHeroLeftPublish(row._id)).unwrap();
      setToast({ type: "success", message: "Publish status updated" });
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to toggle publish status" });
    }
  };

  const removeRow = async () => {
    try {
      await dispatch(deleteHeroLeft(confirmDelete._id)).unwrap();
      setToast({ type: "success", message: "Hero left section deleted" });
      setConfirmDelete(null);
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to delete hero left section" });
    }
  };

  return (
    <section className="space-y-3">
      {toast ? (
        <div
          className={`fixed right-4 top-4 z-[60] rounded-lg px-3 py-2.5 text-sm text-white shadow-lg ${
            toast.type === "error" ? "bg-rose-600" : "bg-[#008C95]"
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Hero left CMS</h2>
            <p className="text-sm text-slate-500">
              Manage landing hero headline, copy, bullets and CTAs (left column).
            </p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search hero left..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#44cfc3] md:w-64"
            />
            <button
              type="button"
              onClick={() => {
                setEditingRow(null);
                reset(defaultValues);
                setIsModalOpen(true);
              }}
              className="rounded-lg bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] px-4 py-2 text-sm font-semibold text-white"
            >
              Add entry
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2.5">Label</th>
              <th className="px-3 py-2.5">Headline</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Visible</th>
              <th className="px-3 py-2.5">Order</th>
              <th className="px-3 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Loading hero left sections...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-rose-600">
                  {error}
                </td>
              </tr>
            ) : activeRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No hero left entries found.
                </td>
              </tr>
            ) : (
              activeRows.map((row) => (
                <tr key={row._id} className="border-t border-slate-100">
                  <td className="px-3 py-2.5 font-medium text-slate-800">{row.sectionLabel}</td>
                  <td className="px-3 py-2.5 text-slate-700">{row.headlineLine1}</td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => togglePublish(row)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.publishStatus === "published"
                          ? "bg-[#00A896]/15 text-[#005F6B]"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.publishStatus}
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(row)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.isVisible ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {row.isVisible ? "Shown" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">{row.displayOrder}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRow(row);
                          reset(rowToForm(row));
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(row)}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
        <p className="text-slate-600">
          Page {pagination.page || page} of {pagination.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={(pagination.page || page) <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={(pagination.page || page) >= (pagination.totalPages || 1)}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingRow ? "Edit hero left" : "Add hero left"}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-sm text-slate-500">
                Close
              </button>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-sm text-slate-700">
                  Section label
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register("sectionLabel", { required: true })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Display order
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register("displayOrder", { required: true, valueAsNumber: true })}
                  />
                </label>
              </div>
              <label className="block text-sm text-slate-700">
                Badge (pill)
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  {...register("badgeLabel", { required: true })}
                />
              </label>
              <label className="block text-sm text-slate-700">
                Headline line 1 (white)
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  {...register("headlineLine1", { required: true })}
                />
              </label>
              <label className="block text-sm text-slate-700">
                Headline line 2 (gradient)
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  {...register("headlineLine2", { required: true })}
                />
              </label>
              <label className="block text-sm text-slate-700">
                Body paragraph 1
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  {...register("bodyParagraph1", { required: true })}
                />
              </label>
              <label className="block text-sm text-slate-700">
                Phrase to bold in paragraph 1 (optional, exact substring)
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  {...register("highlightPhrase")}
                />
              </label>
              <label className="block text-sm text-slate-700">
                Body paragraph 2 (italic strip)
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  {...register("bodyParagraph2", { required: true })}
                />
              </label>

              <div className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Bullet points</p>
                  <button
                    type="button"
                    onClick={() => append({ point: "" })}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
                  >
                    Add bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        placeholder="Bullet text"
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        {...register(`bulletPoints.${index}.point`, { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="shrink-0 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-600 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-sm text-slate-700">
                  Primary CTA label
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register("primaryCtaLabel", { required: true })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Primary CTA link (URL or #anchor)
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register("primaryCtaHref")}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Secondary CTA label
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register("secondaryCtaLabel", { required: true })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Secondary CTA path (e.g. #top)
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register("secondaryCtaPath")}
                  />
                </label>
              </div>

              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-800">Social proof avatars (optional)</p>
                <p className="mt-1 text-xs text-slate-500">
                  Up to three photos next to the trust line. JPEG, PNG, GIF or WebP, max 2 MB each. Empty slots keep the
                  gradient circles on the landing page.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {[0, 1, 2].map((slot) => (
                    <div key={slot} className="rounded-lg border border-slate-100 bg-slate-50/90 p-2">
                      <p className="text-xs font-medium text-slate-600">Photo {slot + 1}</p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-col">
                        <div className="flex items-center gap-2">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-sm">
                            {avatarSlots[slot] ? (
                              <img
                                src={resolveHeroAssetPreview(avatarSlots[slot])}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                                —
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              disabled={uploadingSlot === slot}
                              className="block w-full max-w-full text-[11px] file:mr-1 file:rounded file:border-0 file:bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-white"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                e.target.value = "";
                                if (f) void onAvatarFile(slot, f);
                              }}
                            />
                          </div>
                        </div>
                        <input type="hidden" {...register(`socialProofAvatarUrls.${slot}`)} />
                        {avatarSlots[slot] ? (
                          <button
                            type="button"
                            onClick={() => setValue(`socialProofAvatarUrls.${slot}`, "")}
                            className="self-start rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100"
                          >
                            Remove photo
                          </button>
                        ) : null}
                        {uploadingSlot === slot ? (
                          <span className="text-[11px] text-slate-500">Uploading…</span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <label className="block text-sm text-slate-700">
                Social proof line
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  {...register("socialProofText", { required: true })}
                />
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input type="checkbox" {...register("isVisible")} />
                  Show section
                </label>
                <label className="text-sm text-slate-700">
                  Publish status
                  <select className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" {...register("publishStatus")}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutationLoading}
                  className="rounded-lg bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {mutationLoading ? "Saving..." : editingRow ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">Delete hero left entry?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will soft-delete <span className="font-medium">{confirmDelete.sectionLabel}</span>.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button type="button" onClick={removeRow} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
