import { useEffect, useState } from "react";
import { createHotel } from "@/api/hotelApi";
import { getAllLocations } from "@/api/locationApi";
import { useNavigate } from "react-router-dom";
import "./CreateHotel.css";

function CreateHotel() {
  const [form, setForm] = useState({
    hotelName: "",
    description: "",
    locationId: "",
    street: "",
    pincode: "",
    hotelContact: "",
    hotelEmail: "",
    pricePerDay: "",
    totalRooms: "",
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [locations, setLocations] = useState([]);

  const [previewImages, setPreviewImages] = useState({
    image1: "",
    image2: "",
    image3: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load Locations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await getAllLocations();
        setLocations(res.data?.data?.locations || []);
      } catch {
        alert("Unable to load locations.");
      }
    };
    loadLocations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages({
      ...images,
      [e.target.name]: file,
    });

    setPreviewImages({
      ...previewImages,
      [e.target.name]: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.hotelName.trim()) return alert("Hotel Name is required.");
    if (!form.locationId) return alert("Please select a location.");
    if (!form.pricePerDay) return alert("Enter room price.");
    if (!form.totalRooms) return alert("Enter total rooms.");

    const formData = new FormData();
    formData.append(
      "requestDto",
      new Blob([JSON.stringify(form)], { type: "application/json" }),
    );

    formData.append("image1", images.image1);
    formData.append("image2", images.image2);
    formData.append("image3", images.image3);

    try {
      setLoading(true);
      await createHotel(formData);
      alert("Hotel created successfully!");
      navigate("/admin/manage-hotels");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to create hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-hotel-page">
      {/* Hero Header */}
      <div className="create-hotel-hero">
        <div>
          <h1>Create New Hotel</h1>
          <p>
            Register a new hotel property by entering the required details
            below.
          </p>
        </div>
      </div>

      <form className="create-hotel-form" onSubmit={handleSubmit}>
        <div className="form-layout-grid">
          <div className="form-left-col">
            <div className="form-card">
              <h2>Property Information</h2>
              <div className="form-grid">
                <div>
                  <label>Hotel Name</label>
                  <input
                    type="text"
                    name="hotelName"
                    placeholder="Enter hotel name"
                    value={form.hotelName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Location</label>
                  <select
                    name="locationId"
                    value={form.locationId}
                    onChange={handleChange}
                  >
                    <option value="">Select Location</option>
                    {locations.map((location) => (
                      <option
                        key={location.locationId}
                        value={location.locationId}
                      >
                        {location.locationName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="full-width">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    name="description"
                    placeholder="Please describe the hotel description..."
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="form-card">
              <h2>Address Details</h2>
              <div className="form-grid">
                <div>
                  <label>Street</label>
                  <input
                    name="street"
                    placeholder="Enter street name"
                    value={form.street}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Pincode</label>
                  <input
                    name="pincode"
                    placeholder="Enter pincode"
                    value={form.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-right-col">
            <div className="form-card">
              <h2>Contact Information</h2>
              <div className="form-grid">
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="hotelEmail"
                    placeholder="example@email.com"
                    value={form.hotelEmail}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="hotelContact"
                    placeholder="Enter phone number"
                    value={form.hotelContact}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* PRICING & ROOMS */}
            <div className="form-card">
              <h2>Pricing & Rooms</h2>
              <div className="form-grid">
                <div>
                  <label>Price Per Night</label>
                  <input
                    type="number"
                    name="pricePerDay"
                    placeholder="Enter price per night"
                    value={form.pricePerDay}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Total Rooms</label>
                  <input
                    type="number"
                    name="totalRooms"
                    placeholder="Enter total rooms"
                    value={form.totalRooms}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* HOTEL IMAGES */}
            <div className="form-card">
              <h2>Hotel Images</h2>
              <div className="image-upload-grid">
                {[1, 2, 3].map((index) => {
                  const imageKey = `image${index}`;
                  const selectedFile = images[imageKey];

                  return (
                    <div className="image-upload-card" key={index}>
                      <span className="card-title">Image {index}</span>

                      <label
                        htmlFor={`file-input-${index}`}
                        className="custom-file-upload"
                      >
                        <svg
                          className="upload-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          ></path>
                        </svg>
                        <span>
                          {selectedFile ? "Change File" : "Choose File"}
                        </span>
                      </label>

                      <input
                        id={`file-input-${index}`}
                        type="file"
                        accept="image/*"
                        name={imageKey}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />

                      {selectedFile && (
                        <span className="file-name-text">
                          {selectedFile.name}
                        </span>
                      )}

                      {previewImages[imageKey] && (
                        <div className="image-preview-wrapper">
                          <img
                            src={previewImages[imageKey]}
                            alt={`Preview ${index}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BUTTON ACTION BAR */}
        <div className="form-buttons">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/manage-hotels")}
          >
            Cancel
          </button>

          <button className="submit-btn" disabled={loading}>
            {loading ? "Creating Hotel..." : "Create Hotel"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateHotel;
