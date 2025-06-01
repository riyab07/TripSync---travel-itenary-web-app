import json
import os
from datetime import datetime

DATA_FILE = 'data/inventory.json'

class InventoryManager:
    def __init__(self):
        if not os.path.exists('data'):
            os.makedirs('data')
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'w') as f:
                json.dump([], f)

    def _load(self):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)

    def _save(self, data):
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)

    def add_item(self, id, name, qty, storage, expiry):
        inventory = self._load()
        item = {
            "id": id,
            "name": name,
            "qty": qty,
            "storage": storage,
            "expiry": expiry
        }
        inventory.append(item)
        self._save(inventory)
        return item

    def get_inventory(self):
        return self._load()

    def update_item(self, id, qty):
        inventory = self._load()
        for item in inventory:
            if item['id'] == id:
                item['qty'] = qty
                self._save(inventory)
                return item
        return None
