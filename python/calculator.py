import tkinter as tk
from tkinter import messagebox

# Function to update the input field when a button is clicked
def button_click(item):
    current = input_field.get()
    input_field.delete(0, tk.END)
    input_field.insert(tk.END, current + str(item))

# Function to clear the input field
def button_clear():
    input_field.delete(0, tk.END)

# Function to evaluate the input expression
def button_equal():
    try:
        result = str(eval(input_field.get()))
        input_field.delete(0, tk.END)
        input_field.insert(tk.END, result)
    except:
        messagebox.showerror("Error", "Invalid input")

# Setting up the GUI window
window = tk.Tk()
window.title("Simple Calculator")
window.geometry("400x500")

input_field = tk.Entry(window, font=('arial', 20, 'bold'), borderwidth=5, width=22, justify=tk.RIGHT)
input_field.grid(row=0, column=0, columnspan=4)

# Creating calculator buttons
buttons = [
    '7', '8', '9', '/', 
    '4', '5', '6', '*', 
    '1', '2', '3', '-', 
    'C', '0', '=', '+'
]

# Positioning buttons on the window
row_val = 1
col_val = 0
for button in buttons:
    if button == 'C':
        tk.Button(window, text=button, width=10, height=3, command=button_clear).grid(row=row_val, column=col_val)
    elif button == '=':
        tk.Button(window, text=button, width=10, height=3, command=button_equal).grid(row=row_val, column=col_val)
    else:
        tk.Button(window, text=button, width=10, height=3, command=lambda b=button: button_click(b)).grid(row=row_val, column=col_val)
    
    col_val += 1
    if col_val > 3:
        col_val = 0
        row_val += 1

# Run the GUI window loop
window.mainloop()
