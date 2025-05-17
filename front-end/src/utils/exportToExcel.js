// utils/exportToExcel.js
import * as XLSX from "xlsx";

export function exportShoppingListToExcel(shoppingListItems) {
  const sorted = [...shoppingListItems].sort((a, b) => a.is_checked - b.is_checked);

  const data = sorted.map(item => ({
    Ingredient: item.ingredient.name,
    Cantitate: item.quantity,
    Unitate: item.ingredient.unit,
    "Cumparat": item.is_checked ? true : false,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ShoppingList");

  XLSX.writeFile(workbook, "shopping_list.xlsx");
}
