import React, { useState, useEffect } from "react";
import "../../styles/AdEvent.css";
import api from "../../api";
import Notification from "../../components/Notification";

export default function ManageEvents() {
  const [eventsList, setEventsList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);

  const initialFormState = {
    title: "",
    speaker: "",
    speakerTitle: "",
    speakerImg: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    attendees: "",
    status: "upcoming",
    featured: false,
    img: "",
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

    const poster =
      event.media && event.media[0] ? event.media[0].mediaUrl : null;
    const speakerImage =
      event.media && event.media[1] ? event.media[1].mediaUrl : null;

    setFormData({
      ...event,

      agenda: event.agenda ? event.agenda.join("\n") : "",

      img: poster ? `http://localhost:4000/${poster}` : null,
      speakerImg: speakerImage ? `http://localhost:4000/${speakerImage}` : null,
    });

    setActiveTab("info");

    setShowForm(true);
  };

  const openDeleteConfirmation = (id) => {
    setEventIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/events/${eventIdToDelete}`);
      setEventsList((prev) =>
        prev.filter((item) => item.id !== eventIdToDelete),
      );
      setShowDeleteModal(false);
    } catch (err) {
      setNotification({
        message: "حدث خطأ أثناء الحذف",
        type: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("speaker", formData.speaker);
    formDataToSend.append("speakerTitle", formData.speakerTitle);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("time", formData.time);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("attendees", formData.attendees);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("featured", formData.featured ? "1" : "0");
    formDataToSend.append("description", formData.description);
    formDataToSend.append(
      "agenda",
      JSON.stringify(formData.agenda ? formData.agenda.split("\n") : []),
    );

    if (formData.img instanceof File) {
      formDataToSend.append("images", formData.img);
    }

    if (formData.speakerImg instanceof File) {
      formDataToSend.append("images", formData.speakerImg);
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditing) {
        await api.put(`/admin/events/${formData.id}`, formDataToSend, config);
      } else {
        await api.post("/admin/events", formDataToSend, config);
      }

      const res = await api.get("/events/active");
      setEventsList(res.data);
      setShowForm(false);
      setNotification({
        message: "تمت العملية بنجاح",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: "حدث خطأ أثناء حفظ الفعالية: ",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/active");
        setEventsList(res.data);
      } catch (err) {
        console.error("خطأ في جلب الفعاليات:", err);
      }
    };
    fetchEvents();
  }, []);
  return (
    <div className="manage-events-container" dir="rtl">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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
                        {formData.img && (
                          <div style={{ marginBottom: "10px" }}>
                            <img
                              src={
                                formData.img instanceof File
                                  ? URL.createObjectURL(formData.img)
                                  : formData.img
                              }
                              alt="Event Preview"
                              style={{
                                width: "100%",
                                maxHeight: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}
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
                            ? " تغيير غلاف الفعالية"
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
                        {formData.speakerImg && (
                          <div style={{ marginBottom: "10px" }}>
                            <img
                              src={
                                formData.speakerImg instanceof File
                                  ? URL.createObjectURL(formData.speakerImg)
                                  : formData.speakerImg
                              }
                              alt="Speaker Preview"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
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
                            ? " تغيير صورة المتحدث"
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
