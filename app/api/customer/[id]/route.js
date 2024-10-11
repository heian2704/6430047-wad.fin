import Customer from "@/models/Customer";

export async function GET(request, { params }) {
  const id = params.id; // Assuming you're using Next.js
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return Response.json(customer);
  } catch (error) {
    return new Response("Error fetching customer", { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  const id = params.id;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error deleting customer", { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const customer = await Customer.findByIdAndUpdate(body._id, body, { new: true });
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error updating customer", { status: 500 });
  }
}
