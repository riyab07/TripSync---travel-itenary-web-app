import streamlit as st
import pandas as pd
from datetime import datetime
import requests
from PIL import Image
import io
from recipe_suggester import RecipeSuggester
from spoilage_predictor import SpoilagePredictor
from streamlit_webrtc import webrtc_streamer, VideoProcessorBase, RTCConfiguration
import av
import numpy as np
import cv2

# Initialize session state for inventory
if 'inventory' not in st.session_state:
    st.session_state.inventory = []

# Initialize backend classes
recipe_suggester = RecipeSuggester()
spoilage_predictor = SpoilagePredictor()

# Streamlit app configuration
st.set_page_config(page_title="FoodEye - Food Item Tracker", layout="wide", page_icon="🍎")

# Custom CSS for a colorful, competition-ready UI
st.markdown("""
    <style>
    .main {
        background: linear-gradient(135deg, #f9e1cc 0%, #f7a1a1 50%, #a1c4fd 100%);
        animation: gradientShift 15s ease infinite;
    }
    @keyframes gradientShift {
        0% {background-position: 0% 50%;}
        50% {background-position: 100% 50%;}
        100% {background-position: 0% 50%;}
    }
    .stButton>button {
        background: linear-gradient(45deg, #ff6b6b, #ff8e53);
        color: white;
        border-radius: 12px;
        font-weight: 600;
        padding: 12px 24px;
        border: none;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: bounceIn 0.8s ease;
    }
    .stButton>button:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(255, 107, 107, 0.5);
        background: linear-gradient(45deg, #ff8e53, #ff6b6b);
    }
    .stTextInput>div>input, .stNumberInput>div>input, .stDateInput>div>input {
        border: 2px solid #ff9f43;
        border-radius: 10px;
        background: #fff7f0;
        color: #2c3e50;
        font-size: 1.1rem;
        padding: 10px;
    }
    .stTextInput>div>input:focus, .stNumberInput>div>input:focus, .stDateInput>div>input:focus {
        border-color: #ff6b6b;
        box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
    }
    .sidebar .sidebar-content {
        background: linear-gradient(180deg, #2c3e50 0%, #1e272e 100%);
        color: white;
        border-radius: 10px;
    }
    .sidebar .stRadio label {color: white; font-weight: 500;}
    h1 {color: #d63031; text-align: center; font-size: 2.5rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}
    h2 {color: #e17055; text-align: center; font-size: 1.8rem;}
    .stDataFrame {background: #ffffff; border-radius: 12px; padding: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);}
    .stExpander {background: #fff7f0; border-radius: 12px; color: #2c3e50; border: 1px solid #ff9f43;}
    .recipe-card {background: #ffffff; padding: 20px; border-radius: 10px; margin-bottom: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);}
    .spoilage-bar {height: 10px; border-radius: 5px; background: #dfe6e9;}
    .spoilage-bar-fill {height: 100%; border-radius: 5px; background: linear-gradient(90deg, #00ff88, #ff6b6b);}
    .highlight-title {
        font-size: 5rem;
        font-weight: 800;
        font-family: 'Arial', sans-serif;
        background: linear-gradient(45deg, #ff6b6b, #ff8e53, #a1c4fd);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 20px rgba(255, 107, 107, 0.7), 0 0 30px rgba(161, 196, 253, 0.5);
        animation: glow 2s ease-in-out infinite alternate, fadeIn 1.5s ease;
    }
    .tagline {
        font-size: 1.5rem;
        color: #2c3e50;
        text-align: center;
        font-style: italic;
        animation: fadeIn 2s ease;
        margin-top: 10px;
    }
    @keyframes glow {
        from {text-shadow: 0 0 10px rgba(255, 107, 107, 0.5), 0 0 20px rgba(161, 196, 253, 0.3);}
        to {text-shadow: 0 0 20px rgba(255, 107, 107, 0.8), 0 0 30px rgba(161, 196, 253, 0.6);}
    }
    @keyframes fadeIn {
        from {opacity: 0; transform: translateY(20px);}
        to {opacity: 1; transform: translateY(0);}
    }
    @keyframes bounceIn {
        0% {transform: scale(0.5); opacity: 0;}
        60% {transform: scale(1.2); opacity: 1;}
        100% {transform: scale(1);}
    }
    .home-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 40px;
        margin: 20px;
        position: relative;
        overflow: hidden;
        animation: fadeIn 1s ease;
    }
    .food-icon {
        position: absolute;
        font-size: 2rem;
        opacity: 0.3;
        animation: float 5s ease-in-out infinite;
    }
    .food-icon:nth-child(1) {top: 10%; left: 10%; animation-delay: 0s;}
    .food-icon:nth-child(2) {top: 20%; right: 15%; animation-delay: 1s;}
    .food-icon:nth-child(3) {bottom: 15%; left: 20%; animation-delay: 2s;}
    .food-icon:nth-child(4) {bottom: 10%; right: 10%; animation-delay: 3s;}
    @keyframes float {
        0% {transform: translateY(0);}
        50% {transform: translateY(-20px);}
        100% {transform: translateY(0);}
    }
    .button-container {
        display: flex;
        gap: 20px;
        margin-top: 20px;
    }
    </style>
""", unsafe_allow_html=True)

# Sidebar for navigation
st.sidebar.title("🍴 FoodEye")
st.sidebar.markdown("<p style='color: #dfe6e9; font-size: 0.9rem;'>Your smart kitchen companion!</p>", unsafe_allow_html=True)
page = st.sidebar.radio("Navigate", ["Home", "Dashboard", "Add Item", "Detect Food", "Recipes", "Spoilage Prediction"], format_func=lambda x: f"🍽️ {x}")

# Home Page
if page == "Home":
    st.markdown("""
        <div class="home-container">
            <div class="food-icon">🍎</div>
            <div class="food-icon">🥕</div>
            <div class="food-icon">🍅</div>
            <div class="food-icon">🥔</div>
            <h1 class="highlight-title">FoodEye</h1>
            <p class="tagline">Your Ultimate Kitchen Companion for a Waste-Free Future! 🌟</p>
            <div style='text-align: center; padding: 20px; animation: fadeIn 2.5s ease;'>
                <h3 style='color: #e17055;'>Track, Cook, Save!</h3>
                <p style='color: #2c3e50; font-size: 1.1rem;'>
                    FoodEye helps you manage your kitchen with smart food detection, inventory tracking, 
                    delicious recipe suggestions, and spoilage predictions. Say goodbye to food waste! 🌽🥕
                </p>
            </div>
            <div class="button-container">
                <div style="display: inline-block;">
                    <button class="stButton">Start Tracking 🍴</button>
                </div>
                <div style="display: inline-block;">
                    <button class="stButton">Explore Recipes 🥗</button>
                </div>
            </div>
        </div>
    """, unsafe_allow_html=True)

    # Handle button clicks
    col1, col2 = st.columns(2)
    with col1:
        if st.button("Start Tracking 🍴", key="home_start"):
            st.session_state.page = "Dashboard"
            st.rerun()
    with col2:
        if st.button("Explore Recipes 🥗", key="home_recipes"):
            st.session_state.page = "Recipes"
            st.rerun()
    st.balloons()

# Dashboard Page
elif page == "Dashboard":
    st.title("🍎 FoodEye Dashboard")
    st.subheader("Your Inventory 📦")
    
    if st.session_state.inventory:
        sort_by_expiry = st.checkbox("Sort by Expiry Date 🕒")
        display_inventory = sorted(st.session_state.inventory, key=lambda x: x["expiry"], reverse=False) if sort_by_expiry else st.session_state.inventory
        df = pd.DataFrame(display_inventory)
        st.dataframe(df[["id", "name", "qty", "storage", "expiry"]], use_container_width=True)
        
        if st.button("Clear All ❌", key="clear_all"):
            if st.checkbox("Confirm: Are you sure you want to clear all items?"):
                st.session_state.inventory = []
                st.success("Inventory cleared! 🧹")
                st.balloons()
    else:
        st.info("No items in inventory. Add or detect items to get started! 🥚")

# Add Item Page
elif page == "Add Item":
    st.title("➕ Add New Food Item")
    with st.form("add_item_form"):
        item_id = st.text_input("Item ID", placeholder="Enter item ID")
        item_name = st.text_input("Item Name", placeholder="e.g., Apple 🍎")
        item_qty = st.number_input("Quantity", min_value=1, value=1)
        item_storage = st.selectbox("Storage", ["Fridge ❄️", "Pantry 🥫", "Freezer 🧊"])
        expiry_date = st.date_input("Expiry Date 📅", min_value=datetime.today())
        submit = st.form_submit_button("Add Item ➕")
        
        if submit:
            if not (item_id and item_name and item_qty and item_storage and expiry_date):
                st.error("Please fill in all fields ❗")
            else:
                new_item = {
                    "id": item_id,
                    "name": item_name,
                    "qty": item_qty,
                    "storage": item_storage,
                    "expiry": expiry_date.strftime("%Y-%m-%d")
                }
                st.session_state.inventory.append(new_item)
                st.success(f"Added {item_name} to inventory! 🎉")
                st.balloons()

# Detect Food Page with Webcam and Upload
elif page == "Detect Food":
    st.title("📸 Detect Food with Camera or Upload")

    if "captured_image" not in st.session_state:
        st.session_state.captured_image = None

    def process_image(image_bytes):
        result_placeholder = st.empty()
        with st.spinner("Detecting food... 🔍"):
            files = {"image": ("snapshot.png", image_bytes, "image/png")}
            try:
                response = requests.post("http://localhost:5000/detect-food", files=files)
                data = response.json()
                if data.get("error"):
                    result_placeholder.error(f"Error: {data['error']} ❗")
                else:
                    result_placeholder.success(f"{data['message']} ✅")
                    if data.get("item"):
                        st.session_state.inventory.append(data["item"])
                        st.success(f"Added {data['item']['name']} to inventory! 🎉")
                        st.balloons()
            except Exception as e:
                result_placeholder.error(f"Failed to detect food: {str(e)} ❗")

    st.subheader("Use Webcam 📷")
    class VideoProcessor(VideoProcessorBase):
        def __init__(self):
            self.snapshot = None

        def recv(self, frame):
            img = frame.to_ndarray(format="bgr24")
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            self.snapshot = img_rgb
            return frame

    rtc_configuration = RTCConfiguration({"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]})
    webrtc_ctx = webrtc_streamer(
        key="webcam",
        video_processor_factory=VideoProcessor,
        rtc_configuration=rtc_configuration,
        media_stream_constraints={"video": True, "audio": False},
    )

    if webrtc_ctx.video_processor:
        if st.button("Capture Snapshot 📸"):
            if webrtc_ctx.video_processor.snapshot is not None:
                snapshot = Image.fromarray(webrtc_ctx.video_processor.snapshot)
                st.session_state.captured_image = snapshot
                st.image(snapshot, caption="Captured Image", width=320)
                img_byte_arr = io.BytesIO()
                snapshot.save(img_byte_arr, format="PNG")
                img_byte_arr = img_byte_arr.getvalue()
                process_image(img_byte_arr)
            else:
                st.warning("No snapshot available. Please wait for the webcam to load.")

    st.subheader("Or Upload an Image 📂")
    uploaded_file = st.file_uploader("Upload a food image", type=["jpg", "png"])
    
    if uploaded_file:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Image", width=320)
        bytes_data = uploaded_file.getvalue()
        process_image(bytes_data)

    if st.button("Refresh Inventory 🔄"):
        st.rerun()

# Recipes Page
elif page == "Recipes":
    st.title("🥗 Recipe Suggestions")
    if st.session_state.inventory:
        with st.spinner("Finding delicious recipes... 🍽️"):
            suggestions = recipe_suggester.suggest_recipes(st.session_state.inventory)
        if suggestions and suggestions[0]["name"] != "No recipe suggestions":
            for recipe in suggestions:
                with st.container():
                    st.markdown(f"<div class='recipe-card'><h3 style='color: #e17055;'>{recipe['name']}</h3>", unsafe_allow_html=True)
                    st.write(f"**Ingredients**: {', '.join(recipe['ingredients'])} 🥕")
                    st.write(f"**Instructions**: {recipe['instructions']} 🍴")
                    st.markdown("</div>", unsafe_allow_html=True)
        else:
            st.warning("No recipes found for current inventory. Try adding more items! 🥚")
            st.write("**Current Inventory**:")
            for item in st.session_state.inventory:
                st.write(f"- {item['name']} (Qty: {item['qty']}, Expiry: {item['expiry']})")
            st.write("**Note**: Recipes require specific ingredients (e.g., tomato, onion, carrot, apple). Ensure items are not expired and match recipe needs.")
    else:
        st.info("Add items to inventory to get recipe suggestions! 🥗")

# Spoilage Prediction Page
elif page == "Spoilage Prediction":
    st.title("🔬 Spoilage Prediction")
    if st.session_state.inventory:
        for item in st.session_state.inventory:
            with st.expander(f"{item['name']} ({item['storage']})"):
                risk = spoilage_predictor.predict_spoilage(item["name"], item["expiry"])
                # Ensure risk is a float and format as percentage
                try:
                    risk_float = float(risk)
                    st.write(f"**Item**: {item['name']} 🍎")
                    st.write(f"**Expiry Date**: {item['expiry']} 📅")
                    st.write(f"**Spoilage Risk**: {risk_float:.2%} ⚠️")
                    st.markdown(f"""
                        <div class='spoilage-bar'>
                            <div class='spoilage-bar-fill' style='width: {risk_float*100}%;'></div>
                        </div>
                    """, unsafe_allow_html=True)
                except (ValueError, TypeError):
                    st.error(f"Error displaying spoilage risk for {item['name']}: Invalid risk value. Please check the SpoilagePredictor logic.")
    else:
        st.info("Add items to inventory to predict spoilage! 🥚")