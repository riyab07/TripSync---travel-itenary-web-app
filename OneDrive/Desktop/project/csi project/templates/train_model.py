# train_model.py

import cv2
import os
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
import joblib

# Folder structure:
# /dataset/apple/*.jpg
# /dataset/banana/*.jpg

data_dir = 'dataset'
labels = []
data = []

for label in os.listdir(data_dir):
    path = os.path.join(data_dir, label)
    if not os.path.isdir(path):
        continue
    for img_file in os.listdir(path):
        img_path = os.path.join(path, img_file)
        img = cv2.imread(img_path)
        img = cv2.resize(img, (100, 100))
        data.append(img.flatten())
        labels.append(label)

X = np.array(data)
y = np.array(labels)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

clf = SVC(kernel='linear', probability=True)
clf.fit(X_train, y_train)

joblib.dump(clf, 'food_model.pkl')
print("Model trained and saved.")
