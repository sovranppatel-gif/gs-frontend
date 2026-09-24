import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import {
  addServices,
  deleteServices,
  editServices,
  flipServicesPublish,
  flipServicesVisibility,
  loadServicesList,
} from "../../../redux/services/servicesSlice.js";

const iconOptions = ["Code", "Palette", "TrendingUp", "Smartphone", "Target", "Lightbulb", "Users", "Globe"];

const defaultValues = {
  sectionBadgeLabel: "",
  heading: "",
  description: "",
  ctaLabel: "Explore this service",
  items: [{ iconKey: "TrendingUp", title: "", desc: "", featuresText: "" }],
  isVisible: true,
  publishStatus: "draft",
  displayOrder: 1,
};

function mapItemsForForm(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [{ iconKey: "TrendingUp", title: "", desc: "", featuresText: "" }];
  }
  return items.map((item) => ({
    iconKey: item.iconKey || "Code",
    title: item.title || "",
    desc: item.desc || "",
    featuresText: Array.isArray(item.features) ? item.features.join("\n") : "",
  }));
}

function buildApiPayload(values) {
  const { items, ...rest } = values;
  return {
    ...rest,
    items: items.map(({ featuresText, ...item }) => ({
      iconKey: item.iconKey,
      title: item.title,
      desc: item.desc,
      features: String(featuresText || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    })),
  };
}

export default function ServicesCmsManager() {
  const dispatch = useDispatch();
  const { rows, pagination, loading, error, mutationLoading } = useSelector((state) => state.services);
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
      dispatch(loadServicesList({ page, limit: 10, search }));
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
    await dispatch(loadServicesList({ page, limit: 10, search })).unwrap();
  };

  const onSubmit = async (values) => {
    const payload = buildApiPayload(values);
    try {
      if (editingRow?._id) {
        await dispatch(editServices({ id: editingRow._id, payload })).unwrap();
        setToast({ type: "success", message: "Services section updated" });
      } else {
        await dispatch(addServices(payload)).unwrap();
        setToast({ type: "success", message: "Services section created" });
      }
      setIsModalOpen(false);
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to save services section" });
    }
  };

  const toggleVisibility = async (row) => {
    try {
      await dispatch(flipServicesVisibility(row._id)).unwrap();
      setToast({ type: "success", message: "Visibility updated" });
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to toggle visibility" });
    }
  };

  const togglePublish = async (row) => {
    try {
      await dispatch(flipServicesPublish(row._id)).unwrap();
      setToast({ type: "success", message: "Publish status updated" });
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to toggle publish status" });
    }
  };

  const removeRow = async () => {
    try {
      await dispatch(deleteServices(confirmDelete._id)).unwrap();
      setToast({ type: "success", message: "Services section deleted" });
      setConfirmDelete(null);
      await refetch();
    } catch (err) {
      setToast({ type: "error", message: err || "Unable to delete services section" });
    }
  };

  const openEdit = (row) => {
    setEditingRow(row);
    reset({
      sectionBadgeLabel: row.sectionBadgeLabel || "",
      heading: row.heading || "",
      description: row.description || "",
      ctaLabel: row.ctaLabel || "Explore this service",
      items: mapItemsForForm(row.items),
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
            <h2 className="text-lg font-semibold text-slate-900">Services CMS Manager</h2>
            <p className="text-sm text-slate-500">Manage Services badge, heading, cards and feature bullets.</p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search services content..."
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
              Add Services
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2.5">Badge</th>
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
                  Loading services sections...
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
                  No services entries found.
                </td>
              </tr>
            ) : (
              activeRows.map((row) => (
                <tr key={row._id} className="border-t border-slate-100">
                  <td className="px-3 py-2.5 font-medium text-slate-800">{row.sectionBadgeLabel}</td>
                  <td className="px-3 py-2.5 text-slate-700">{row.heading}</td>
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingRow ? "Edit Services Content" : "Add Services Content"}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-sm text-slate-500">
                Close
              </button>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-sm text-slate-700">
                  Badge label
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register("sectionBadgeLabel", { required: true })}
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Display Order
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
              <label className="block text-sm text-slate-700">
                Description
                <textarea rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" {...register("description", { required: true })} />
              </label>
              <label className="block text-sm text-slate-700">
                Card CTA label
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" {...register("ctaLabel")} />
              </label>

              <div className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Service cards</p>
                  <button
                    type="button"
                    onClick={() => append({ iconKey: "Code", title: "", desc: "", featuresText: "" })}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
                  >
                    Add card
                  </button>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                      <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
                        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" {...register(`items.${index}.iconKey`)}>
                          {iconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                        <input
                          placeholder="Title"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          {...register(`items.${index}.title`, { required: true })}
                        />
                      </div>
                      <input
                        placeholder="Short description"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        {...register(`items.${index}.desc`, { required: true })}
                      />
                      <label className="block text-xs text-slate-600">
                        Feature bullets (one per line)
                        <textarea
                          rows={4}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          {...register(`items.${index}.featuresText`, { required: true })}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-600 disabled:opacity-50"
                      >
                        Remove card
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
                  Publish Status
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
            <h3 className="text-base font-semibold text-slate-900">Delete Services Entry?</h3>
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
