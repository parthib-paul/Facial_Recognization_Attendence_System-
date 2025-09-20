# Facial Recognition Attendance System
## Machine Learning-Powered Automated Attendance Management

A machine learning application that leverages computer vision and ML algorithms to automate student attendance tracking. Built with advanced ML techniques including feature engineering, ensemble learning, and real-time inference for facial recognition.

## Machine Learning Features

### Core ML Capabilities
- **Ensemble Learning**: Random Forest classifier with 150 estimators for face recognition
- **Feature Engineering**: Custom 1024-dimensional feature vectors from facial embeddings
- **Real-time Inference**: Live prediction for attendance marking
- **Model Persistence**: Pickle-based model serialization for deployment
- **Confidence Scoring**: Probability-based recognition with configurable threshold

### Advanced ML Techniques
- **Multi-class Classification**: Student identification using supervised learning
- **Feature Extraction**: Custom embedding generation from 32x32 grayscale images
- **Model Training Pipeline**: Automated training with progress tracking
- **Background Processing**: Asynchronous model training for non-blocking operations

## 🔬 Technical Architecture

### ML Pipeline

**Training Phase:** `Camera → Face Detection → 32x32 Grayscale → 1024D Vector → Random Forest Training → model.pkl`

**Inference Phase:** `Live Camera → Face Detection → Feature Extraction → Random Forest Prediction → Attendance Marking`

### Machine Learning Stack
- **scikit-learn 1.7.2**: Core ML algorithms and model training
- **OpenCV 4.12.0.88**: Computer vision and image preprocessing
- **NumPy 2.2.6**: Numerical computing for ML operations
- **Pandas 2.3.2**: Data manipulation and feature engineering
- **Flask 2.3.3**: ML model serving and API endpoints

## Key ML Features

### Model Architecture
- **Algorithm**: Random Forest with 150 decision trees
- **Features**: 1024-dimensional face embeddings (32x32 grayscale)
- **Training**: Supervised learning on labeled face data
- **Inference**: Real-time prediction with confidence scores

### Feature Engineering
- **Input Processing**: Face detection, cropping, and resizing
- **Feature Extraction**: 32x32 grayscale embeddings
- **Normalization**: Pixel values scaled to [0,1] range
- **Vectorization**: Flattened to 1024-dimensional feature vectors

## Installation & Setup

### Prerequisites
- Python 3.13+
- pip package manager
- Webcam for real-time inference

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd Facial_Recognisation_Attendance_System

# Install ML dependencies
pip install -r requirements.txt

# Run the application
python3 app.py
```

##  ML Model Implementation

### Training Process
1. **Data Collection**: Multiple face images per student
2. **Preprocessing**: Face detection, cropping, and normalization
3. **Feature Extraction**: Convert images to 1024-dimensional vectors
4. **Model Training**: Train Random Forest on feature-label pairs
5. **Model Persistence**: Save trained model for inference

### Feature Engineering Pipeline
```python
# Face preprocessing and feature extraction
def extract_features(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    # Crop and resize face
    face = cv2.resize(face, (32, 32))
    
    # Flatten to feature vector
    features = face.flatten().astype(np.float32) / 255.0
    
    return features  # 1024-dimensional vector
```

### Model Configuration
```python
# Random Forest Classifier
RandomForestClassifier(
    n_estimators=150,      # Ensemble of 150 decision trees
    n_jobs=-1,            # Parallel processing
    random_state=42       # Reproducible results
)
```

##  ML API Endpoints

### Model Training
- `GET /train_model` - Start ML model training
- `GET /train_status` - Monitor training progress
- `POST /upload_face` - Add training data

### Real-time Inference
- `POST /recognize_face` - Live face recognition
- `GET /students` - List all students in model
- `DELETE /students/<id>` - Remove student from model

### Data Management
- `GET /attendance_record` - View ML predictions
- `GET /download_csv` - Export ML results


## ML Model Details

### Training Data Requirements
- **Multiple Images**: 10-20 photos per student recommended
- **Image Quality**: Clear, well-lit face images
- **Diverse Angles**: Front-facing and slight angle variations
- **Consistent Lighting**: Similar lighting conditions

### Model Performance Factors
- **Training Data Quality**: More diverse images improve recognition
- **Feature Engineering**: 32x32 embeddings balance speed and accuracy
- **Confidence Threshold**: 50% default threshold for recognition
- **Lighting Conditions**: Consistent lighting improves performance
