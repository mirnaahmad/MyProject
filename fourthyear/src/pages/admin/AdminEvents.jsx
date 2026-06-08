import React, { useState } from "react";
import { EVENTS } from "../../data/mockData";
import "../../styles/AdEvent.css";

export default function ManageEvents() {
  const [eventsList, setEventsList] = useState(EVENTS);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);

  const initialFormState = {
    id: null,
    title: "",
    speaker: "",
    speakerTitle: "",
    speakerImg: null,
    date: "",
    time: "",
    duration: "",
    location: "",
    attendees: "",
    status: "upcoming",
    featured: false,
    img: null,
    description: "",
    agenda: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleAddNewClick = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setActiveTab("info");
    setShowForm(true);
  };

  const handleEditClick = (event) => {
    setIsEditing(true);
    setFormData({
      ...event,
      agenda: event.agenda ? event.agenda.join("\n") : "",
    });
    setActiveTab("info");
    setShowForm(true);
  };

  const openDeleteConfirmation = (id) => {
    setEventIdToDelete(id);
    setShowDeleteModal(true);
  };

  // تأكيد الحذف النهائي من داخل الصندوق
  const confirmDelete = () => {
    setEventsList(eventsList.filter((item) => item.id !== eventIdToDelete));
    setShowDeleteModal(false);
    setEventIdToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] ? URL.createObjectURL(files[0]) : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const agendaArray = formData.agenda
      ? formData.agenda.split("\n").filter((line) => line.trim() !== "")
      : [];
    const processedData = {
      ...formData,
      attendees: Number(formData.attendees) || 0,
      agenda: agendaArray,
      img:
        formData.img ||
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      speakerImg:
        formData.speakerImg ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    };

    if (isEditing) {
      setEventsList(
        eventsList.map((item) =>
          item.id === formData.id ? { ...item, ...processedData } : item,
        ),
      );
    } else {
      setEventsList([{ ...processedData, id: Date.now() }, ...eventsList]);
    }
    setShowForm(false);
  };

  return (
    <div className="manage-events-container" dir="rtl">
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-box">
            <div className="delete-modal-icon"></div>
            <h3>تأكيد الحذف</h3>
            <p>
              هل أنتِ متأكدة من رغبتكِ في حذف هذه الفعالية نهائياً؟ لا يمكن
              التراجع عن هذا الإجراء.
            </p>
            <div className="delete-modal-buttons">
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                نعم، احذف
              </button>
              <button
                className="cancel-delete-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="manage-events-header">
        <h1 className="page-title">إدارة الفعاليات</h1>
        <button className="add-event-btn" onClick={handleAddNewClick}>
          إضافة فعالية جديدة +
        </button>
      </div>

      <div className="manage-events-content">
        <div
          className={`table-section ${showForm ? "compressed" : "full-width"}`}
        >
          <table className="events-table">
            <thead>
              <tr>
                <th>اسم الفعالية</th>
                <th>المتحدث</th>
                <th>التاريخ والوقت</th>
                <th>المدة</th>
                <th>العدد المستهدف</th>
                <th>المكان</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {eventsList.map((event) => (
                <tr key={event.id}>
                  <td
                    className="event-title-cell"
                    data-label="اسم الفعالية"
                    title={event.title}
                  >
                    {event.title}
                  </td>
                  <td data-label="المتحدث">{event.speaker}</td>
                  <td data-label="التاريخ والوقت">
                    <div className="datetime-cell">
                      <span>{event.date}</span>
                      <small>{event.time}</small>
                    </div>
                  </td>
                  <td data-label="المدة">{event.duration || "غير محدد"}</td>
                  <td data-label="العدد المستهدف">{event.attendees} شخص</td>
                  <td data-label="المكان">{event.location}</td>
                  <td data-label="الإجراء">
                    <div className="action-buttons">
                      <button
                        className="btn-delete"
                        onClick={() => openDeleteConfirmation(event.id)}
                      >
                        حذف
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(event)}
                      >
                        تعديل
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="form-section">
            <div className="form-card">
              <div className="form-card-header">
                <h3>{isEditing ? "تعديل الفعالية" : "إضافة فعالية جديدة"}</h3>
                <button
                  className="close-form-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>

              <div className="form-tabs">
                <button
                  type="button"
                  className={`tab-link ${activeTab === "info" ? "active" : ""}`}
                  onClick={() => setActiveTab("info")}
                >
                  معلومات الفعالية
                </button>
                <button
                  type="button"
                  className={`tab-link ${activeTab === "speaker" ? "active" : ""}`}
                  onClick={() => setActiveTab("speaker")}
                >
                  المتحدث والأجندة
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="tabbed-form-body">
                {activeTab === "info" && (
                  <div className="tab-content-panel">
                    <div className="form-group">
                      <label>اسم الفعالية</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        minLength="5"
                        placeholder="مثال: متطلبات سوق العمل من المبرمجين"
                      />
                    </div>
                    <div className="form-group">
                      <label>وصف الفعالية</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="في هذه الجلسة التفاعلية سنستعرض معاً..."
                        required
                      />
                    </div>
                    <div className="row-inputs">
                      <div className="form-group">
                        <label>التاريخ</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          placeholder="27 أكتوبر 2026"
                        />
                      </div>
                      <div className="form-group">
                        <label>وقت البدء</label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          placeholder="10:00 AM"
                        />
                      </div>
                    </div>
                    <div className="row-inputs">
                      <div className="form-group">
                        <label>المدة الزمنية</label>
                        <input
                          type="text"
                          name="duration"
                          pattern="[0-9]+"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                          placeholder="3 ساعات"
                        />
                      </div>
                      <div className="form-group">
                        <label>المكان / الرابط</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          placeholder="أونلاين / Zoom"
                        />
                      </div>
                    </div>
                    <div className="row-inputs">
                      <div className="form-group">
                        <label>العدد المستهدف للحضور</label>
                        <input
                          type="number"
                          min={1}
                          name="attendees"
                          value={formData.attendees}
                          onChange={handleInputChange}
                          placeholder="120"
                        />
                      </div>
                      <div className="form-group">
                        <label>حالة الفعالية</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="form-select-input"
                        >
                          <option value="upcoming">قادمة</option>
                          <option value="completed">مكتملة</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>صورة غلاف الفعالية</label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          name="img"
                          accept="image/*"
                          onChange={handleInputChange}
                          id="event-img-file"
                        />
                        <label
                          htmlFor="event-img-file"
                          className="file-upload-label"
                        >
                          {formData.img
                            ? "✓ تم اختيار غلاف الفعالية"
                            : "اختر صورة الغلاف من جهازك"}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "speaker" && (
                  <div className="tab-content-panel">
                    <div className="row-inputs">
                      <div className="form-group">
                        <label>اسم المتحدث</label>
                        <input
                          type="text"
                          name="speaker"
                          value={formData.speaker}
                          onChange={handleInputChange}
                          required
                          placeholder="أسامة دعبوس"
                        />
                      </div>
                      <div className="form-group">
                        <label>صِفة المتحدث التقنية</label>
                        <input
                          type="text"
                          name="speakerTitle"
                          value={formData.speakerTitle}
                          onChange={handleInputChange}
                          required
                          placeholder="مثال: مطور برمجيات ومدرب تقني"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>صورة المتحدث الشخصية</label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          name="speakerImg"
                          accept="image/*"
                          onChange={handleInputChange}
                          id="speaker-img-file"
                        />
                        <label
                          htmlFor="speaker-img-file"
                          className="file-upload-label"
                        >
                          {formData.speakerImg
                            ? "✓ تم اختيار صورة المتحدث"
                            : "اختر صورة المتحدث من جهازك"}
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>أجندة الفعالية (كل نقطة في سطر منفصل)</label>
                      <textarea
                        name="agenda"
                        value={formData.agenda}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder="أسرار العمل الحر&#10;كيف تبني ملفك الشخصي التقني"
                        required
                      />
                    </div>
                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                        />
                        تمييز الفعالية في الرئيسية
                      </label>
                    </div>
                    <button type="submit" className="submit-btn">
                      {isEditing
                        ? "حفظ التعديلات النهائية"
                        : "رفع ونشر الفعالية"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
