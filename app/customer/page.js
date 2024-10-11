"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function CustomerPage() {
  const APIBASE = process.env.NEXT_PUBLIC_API_BASE; // Ensure this is set correctly in .env
  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null); // Store the currently editing customer ID

  const { register, handleSubmit, reset } = useForm();

  // Fetch the list of customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${APIBASE}/customer`);
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const customers = await response.json();
      setCustomerList(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Function to handle customer form submission
  const handleCustomerFormSubmit = async (data) => {
    if (editMode) {
      // Update existing customer
      try {
        const response = await fetch(`${APIBASE}/customer`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, _id: currentCustomerId }), // Include currentCustomerId for update
        });
        if (!response.ok) {
          throw new Error("Failed to update customer");
        }
        reset(); // Reset form fields
        setEditMode(false);
        setCurrentCustomerId(null); // Clear the current customer ID
        await fetchCustomers(); // Refresh customer list after updating
      } catch (error) {
        console.error("Error updating customer:", error);
      }
    } else {
      // Create new customer
      try {
        const response = await fetch(`${APIBASE}/customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Failed to create customer");
        }
        reset(); // Reset the form after adding
        await fetchCustomers(); // Refresh customer list after adding
      } catch (error) {
        console.error("Error creating customer:", error);
      }
    }
  };

  const startEdit = (customer) => {
    setEditMode(true);
    setCurrentCustomerId(customer._id); // Set the ID for the customer being edited
    reset({
      name: customer.name,
      dob: customer.dob.split("T")[0], // Format the date correctly for input
      memberNumber: customer.memberNumber,
      interests: customer.interests.join(", "), // Format interests for input
    }); // Populate form with customer details
  };

  const deleteById = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(`${APIBASE}/customer/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }
      await fetchCustomers(); // Refresh customer list after deletion
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomers(); // Fetch customers on component mount
  }, []);

  return (
    <main>
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64">
          <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
            <div className="grid grid-cols-2 gap-4 w-fit m-4">
              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Date of Birth:</div>
              <div>
                <input
                  name="dob"
                  type="date"
                  {...register("dob", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Member Number:</div>
              <div>
                <input
                  name="memberNumber"
                  type="number"
                  {...register("memberNumber", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Interests:</div>
              <div>
                <input
                  name="interests"
                  type="text"
                  {...register("interests", { required: true })}
                  placeholder="e.g. Movies, Football"
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="col-span-2 text-right">
                <input
                  type="submit"
                  value={editMode ? "Update" : "Add"}
                  className={`${
                    editMode ? "bg-blue-800" : "bg-green-800"
                  } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full`}
                />
                {editMode && (
                  <button
                    type="button" // Prevents form submission
                    onClick={() => {
                      reset();
                      setEditMode(false);
                      setCurrentCustomerId(null); // Clear the current customer ID
                    }}
                    className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <ul>
            {customerList.map((customer) => (
              <li key={customer._id} className="mb-2">
                <div className="flex justify-between">
                  <div>
                    <strong>{customer.name}</strong> [Member #: {customer.memberNumber}]<br />
                    <small>Date of Birth: {new Date(customer.dob).toLocaleDateString()}</small><br />
                    <small>Interests: {customer.interests.join(", ")}</small>
                  </div>
                  <div>
                    <button
                      className="border border-black p-1 ml-2"
                      onClick={() => startEdit(customer)}
                    >
                      📝
                    </button>
                    <button
                      className="border border-black p-1 ml-2"
                      onClick={() => deleteById(customer._id)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
