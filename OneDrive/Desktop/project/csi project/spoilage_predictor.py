from datetime import datetime

class SpoilagePredictor:
    def predict_spoilage(self, item_name, expiry_date):
        """
        Predict the spoilage risk of an item based on its expiry date.
        
        Args:
            item_name (str): Name of the item (e.g., "Apple").
            expiry_date (str): Expiry date in 'YYYY-MM-DD' format.
        
        Returns:
            float: Spoilage risk as a value between 0 and 1 (e.g., 0.75 for 75% risk).
        """
        try:
            # Parse the expiry date
            expiry = datetime.strptime(expiry_date, '%Y-%m-%d')
            today = datetime.now()

            # Calculate days until expiry
            days_until_expiry = (expiry - today).days

            # Simple spoilage risk model:
            # - If expired (days < 0), risk is 100%
            # - If within 7 days, risk increases as expiry nears
            # - If > 7 days, low risk
            if days_until_expiry < 0:
                return 1.0  # 100% risk if already expired
            elif days_until_expiry <= 7:
                # Linear increase in risk from 0% (7 days) to 100% (0 days)
                return 1.0 - (days_until_expiry / 7.0)
            else:
                return 0.1  # 10% risk if more than 7 days left
        except Exception as e:
            print(f"Error predicting spoilage for {item_name}: {str(e)}")
            return 0.5  # Default to 50% risk on error