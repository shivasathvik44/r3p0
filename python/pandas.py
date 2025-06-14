import pandas as pd
import csv 

# Create a small dataset using a dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'Age': [25, 30, 35, 40],
    'City': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
    'Salary': [50000, 60000, 70000, 80000]
}

# Convert the dictionary into a Pandas DataFrame
df = pd.DataFrame(data)

# Display the DataFrame
print("Original DataFrame:")
print(df)

# Basic operations
print("\nBasic Information:")
print(df.info())  # Overview of the DataFrame

print("\nSummary Statistics:")
print(df.describe())  # Summary of numerical columns

print("\nFilter rows where Age is greater than 30:")
print(df[df['Age'] > 30])  # Filter rows based on a condition

# Add a new column
df['Bonus'] = df['Salary'] * 0.10  # Calculate 10% bonus
print("\nDataFrame with Bonus column added:")
print(df)

# Save the DataFrame to a CSV file
df.to_csv('output.csv', index=False)
print("\nDataFrame saved to 'output.csv'")