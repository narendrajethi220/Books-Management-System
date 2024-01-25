import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Update = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [price, setPrice] = useState(null);
  const [cover, setCover] = useState("");
  const [coverPreview, setCoverPreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:3002/books/" + id)
      .then((res) => {
        // console.log(res.data);
        setTitle(res.data[0].title);
        setDescr(res.data[0].descr);
        setPrice(res.data[0].price);
        setCoverPreview(`http://localhost:3002/images/${res.data[0].cover}`);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleClick = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("descr", descr);
    formData.append("price", price);

    if (cover && cover instanceof File) {
      formData.append("cover", cover);
    }
    try {
      const response = await Axios.put(
        `http://localhost:3002/books/${id}`,
        formData
      );
      navigate("/");
      if (response.data.updated) {
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error during update request:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setCover(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setCoverPreview(null);
    }
  };
  return (
    <div className="form">
      <h1>Update Book</h1>
      <input
        type="text"
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
        name="title"
        value={title || ""}
      />
      <input
        type="text"
        placeholder="description"
        onChange={(e) => setDescr(e.target.value)}
        name="descr"
        value={descr || ""}
      />
      <input
        type="number"
        placeholder="price"
        onChange={(e) => setPrice(e.target.value)}
        name="price"
        value={price || ""}
      />
      <div className="img">
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover Preview"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
        )}
      </div>
      <input
        type="file"
        placeholder="uploade cover image"
        onChange={handleFileChange}
        name="cover"
      />
      <button className="formButton" onClick={handleClick}>
        Update
      </button>
    </div>
  );
};

export default Update;
