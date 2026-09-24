import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import {
  addFaq,
  deleteFaq,
  editFaq,
  flipFaqPublish,
  flipFaqVisibility,
  loadFaqList,
} from "../../../redux/faq/faqSlice.js";

const defaultValues = {
  sectionLabel: "",
  heading: "",
  items: [{ question: "", answer: "" }],
  isVisible: true,
  publishStatus: "draft",
  displayOrder: 1,
};

export default function FaqCmsManager() {
  const dispatch = useDispatch();
  const { rows, pagination, loading, error, mutationLoading } = useSelector((state) => state.faq);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, control, reset } = useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      dispatch(loadFaqList({ page, limit: 10, search }));
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
    await dispatch(loadFaqList({ page, limit: 10, search })).unwrap();
  };

  const onSubmit = async (values) => {
    try {
      if (editingRow?._id) {
        await dispatch(editFaq({ id: editingRow._id, payload: values })).unwrap();
        setToast({ type: "success", message: "FAQ section updated" });
      } else {
        await dispatch(addFaq(values)).unwrap();
        setToast({ type: "success", message: "FAQ section created" });
      }
      setIsModalOpen(false);
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to save FAQ section" });
    }
  };

  const toggleVisibility = async (row) => {
    try {
      await dispatch(flipFaqVisibility(row._id)).unwrap();
      setToast({ type: "success", message: "Visibility updated" });
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to toggle visibility" });
    }
  };

  const togglePublish = async (row) => {
    try {
      await dispatch(flipFaqPublish(row._id)).unwrap();
      setToast({ type: "success", message: "Publish status updated" });
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to toggle publish status" });
    }
  };

  const removeRow = async () => {
    try {
      await dispatch(deleteFaq(confirmDelete._id)).unwrap();
      setToast({ type: "success", message: "FAQ section deleted" });
      setConfirmDelete(null);
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to delete FAQ section" });
    }
  };

  const openEdit = (row) => {
    setEditingRow(row);
    reset({
      sectionLabel: row.sectionLabel || "",
      heading: row.heading || "",
      items: row.items?.length ? row.items : [{ question: "", answer: "" }],
      isVisible: row.isVisible ?? true,
      publishStatus: row.publishStatus || "draft",
      displayOrder: row.displayOrder ?? 1,
    });
    setIsModalOpen(true);
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
            <h2 className="text-lg font-semibold text-slate-900">FAQ CMS Manager</h2>
            <p className="text-sm text-slate-500">Manage FAQ label, heading and Q&amp;A pairs.</p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search FAQ content..."
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
              Add FAQ
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2.5">Label</th>
              <th className="px-3 py-2.5">Heading</th>
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
                  Loading FAQ sections...
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
                  No FAQ entries found.
                </td>
              </tr>
            ) : (
              activeRows.map((row) => (
                <tr key={row._id} className="border-t border-slate-100">
                  <td className="px-3 py-2.5 font-medium text-slate-800">{row.sectionLabel}</td>
                  <td className="max-w-xs truncate px-3 py-2.5 text-slate-700">{row.heading}</td>
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
                        onClick={() => openEdit(row)}
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
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{editingRow ? "Edit FAQ section" : "Add FAQ section"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-sm text-slate-500">
                Close
              </button>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-sm text-slate-700">
                  Section label
                  <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" {...register("sectionLabel", { required: true })} />
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
                Heading
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" {...register("heading", { required: true })} />
              </label>

              <div className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Questions</p>
                  <button type="button" onClick={() => append({ question: "", answer: "" })} className="rounded-lg border border-slate-200 px-3 py-1 text-xs">
                    Add question
                  </button>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                      <input
                        placeholder="Question"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        {...register(`items.${index}.question`, { required: true })}
                      />
                      <textarea
                        rows={3}
                        placeholder="Answer"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        {...register(`items.${index}.answer`, { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-600 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

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
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
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
            <h3 className="text-base font-semibold text-slate-900">Delete FAQ section?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will soft-delete <span className="font-medium">{confirmDelete.heading}</span>.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
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
