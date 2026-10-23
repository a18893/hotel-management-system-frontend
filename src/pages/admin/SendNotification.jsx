import { useState } from "react";
import { sendNotification } from "../../api/notificationApi";
import "./SendNotification.css";

function SendNotification() {
  const [form, setForm] = useState({
    userId: "",
    recipientEmail: "",
    message: "",
    notificationType: "EMAIL",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.userId || !form.recipientEmail || !form.message.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSending(true);
      await sendNotification(form);
      alert("Notification sent successfully.");
      setForm({
        userId: "",
        recipientEmail: "",
        message: "",
        notificationType: "EMAIL",
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="send-notification-page">
      {/*=== HERO ===*/}

      <section className="notification-hero">
        <div>
          <h1>Send Notifications</h1>

          <p>
            Instantly send Email or SMS notifications to users for booking
            updates, announcements, reminders and important platform
            information.
          </p>
        </div>
      </section>

      {/*=== FORM CARD ===*/}

      <section className="notification-card">
        <div className="section-header">
          <div>
            <h2>Create Notification</h2>

            <p>
              Complete the form below to send a notification to a registered
              user.
            </p>
          </div>
        </div>

        <div className="notification-form">
          <div className="form-grid">
            {/* USER ID */}

            <div className="form-group">
              <label>User ID</label>

              <input
                type="text"
                name="userId"
                className="form-control"
                placeholder="Enter User ID"
                value={form.userId}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}

            <div className="form-group">
              <label>Recipient Email</label>

              <input
                type="email"
                name="recipientEmail"
                className="form-control"
                placeholder="Enter recipient email"
                value={form.recipientEmail}
                onChange={handleChange}
              />
            </div>

            {/* NOTIFICATION TYPE */}

            <div className="form-group full-width">
              <label>Notification Type</label>

              <select
                name="notificationType"
                className="form-select"
                value={form.notificationType}
                onChange={handleChange}
              >
                <option value="EMAIL">Email Notification</option>

                <option value="SMS">SMS Notification</option>
              </select>
            </div>

            {/* MESSAGE */}

            <div className="form-group full-width">
              <label>Message</label>

              <textarea
                rows="7"
                name="message"
                className="form-control"
                placeholder="Write your notification message..."
                value={form.message}
                onChange={handleChange}
              />
            </div>
          </div>

          {/*=== ACTION BUTTON ===*/}

          <div className="notification-actions">
            <button
              className="send-btn"
              onClick={handleSubmit}
              disabled={sending}
            >
              {sending ? "Sending Notification..." : "Send Notification"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SendNotification;
