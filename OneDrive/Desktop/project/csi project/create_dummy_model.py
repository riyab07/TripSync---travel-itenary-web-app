from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
import joblib

# Load sample dataset
data = load_iris()
X, y = data.data, data.target

# Train a simple model
model = RandomForestClassifier()
model.fit(X, y)

# Save the model as 'food_model.pkl'
joblib.dump(model, 'food_model.pkl')

print("Dummy model 'food_model.pkl' created successfully.")
