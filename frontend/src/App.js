import { useState, useEffect, createContext, useContext, useCallback } from "react";
import axios from "axios";

https://erp-backend-64xp.onrender.com
// ─── CONTEXTS ─────────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const ToastCtx = createContext(null);

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  const emojis = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{emojis[t.type]}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (u) => setUser(u);
  const logout = () => setUser(null);
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage() {
  const { login } = useContext(AuthCtx);
  const toast = useContext(ToastCtx);
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("admin@erp.com");
  const [pass, setPass] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const roles = ["Admin", "Sales", "Purchase", "Inventory"];

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login({ name: "Arjun Mehta", role, email });
      toast("Welcome back! 👋", "success");
      setLoading(false);
    }, 900);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">N</div>
          <div className="login-title">NexusERP</div>
          <div className="login-sub">Enterprise Resource Planning Platform</div>
        </div>
        <div className="form-group">
          <label className="form-label">Login as</label>
          <div className="role-pills">
            {roles.map(r => (
              <div key={r} className={`role-pill ${role === r ? "active" : ""}`} onClick={() => setRole(r)}>{r}</div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }} onClick={handleLogin}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Active: "badge-green", Paid: "badge-green", Delivered: "badge-green", Received: "badge-green", Completed: "badge-green",
    Shipped: "badge-blue", Processing: "badge-blue", Ordered: "badge-blue", "In Transit": "badge-blue", Partial: "badge-blue",
    Pending: "badge-yellow", Overdue: "badge-red", Inactive: "badge-gray", Cancelled: "badge-gray",
    Admin: "badge-purple", Sales: "badge-blue", Purchase: "badge-yellow", Inventory: "badge-green",
  };
  return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── CRUD TABLE ───────────────────────────────────────────────────────────────
function CrudTable({ title, subtitle, columns, data, onAdd, onEdit, onDelete, actions }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 5;
  const filtered = data.filter(row => columns.some(c => String(row[c.key] || "").toLowerCase().includes(search.toLowerCase())));
  const totalPages = Math.ceil(filtered.length / PER);
  const paginated = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-sub">{subtitle}</div>
        </div>
        {onAdd && <button className="btn btn-primary" onClick={onAdd}>+ Add New</button>}
      </div>
      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>{filtered.length} records</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={columns.length + 1}><div className="empty"><div className="empty-icon">📋</div><div className="empty-text">No records found</div></div></td></tr>
              ) : paginated.map((row, i) => (
                <tr key={i}>
                  {columns.map(c => (
                    <td key={c.key}>
                      {c.badge ? <StatusBadge status={row[c.key]} /> :
                       c.mono ? <span className="td-mono">{row[c.key]}</span> :
                       c.render ? c.render(row[c.key], row) : row[c.key]}
                    </td>
                  ))}
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {actions ? actions(row) : <>
                        {onEdit && <button className="btn btn-secondary btn-sm" onClick={() => onEdit(row)}>✏️</button>}
                        {onDelete && <button className="btn btn-danger btn-sm" onClick={() => onDelete(row)}>🗑️</button>}
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Page {page} of {totalPages}</span>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, sales: 0, invoices: 0 });

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/products`),
      axios.get(`${API}/customers`),
      axios.get(`${API}/salesorders`),
      axios.get(`${API}/invoices`),
    ]).then(([p, c, s, i]) => {
      setStats({ products: p.data.length, customers: c.data.length, sales: s.data.length, invoices: i.data.length });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Welcome back! Here's your overview.</div>
        </div>
      </div>
      <div className="stats-grid">
        {[
          { label: "Total Products", value: stats.products, color: "blue", icon: "📦" },
          { label: "Customers", value: stats.customers, color: "green", icon: "👥" },
          { label: "Sales Orders", value: stats.sales, color: "yellow", icon: "🛒" },
          { label: "Invoices", value: stats.invoices, color: "purple", icon: "🧾" },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🚀 ERP System Ready!</div></div>
        <p style={{ color: "var(--muted2)", fontSize: 14 }}>Your NexusERP system is fully connected to MongoDB. Start adding data using the modules in the sidebar!</p>
      </div>
    </div>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
function ProductsPage() {
  const toast = useContext(ToastCtx);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = () => axios.get(`${API}/products`).then(r => setData(r.data)).catch(() => toast("Failed to load", "error"));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ title: "", sku: "", price: "", stock: "", reorderLevel: "", category: "Electronics" }); setModal("add"); };
  const openEdit = (row) => { setForm({ ...row }); setModal("edit"); };
  const handleDelete = async (row) => {
    await axios.delete(`${API}/products/${row._id}`);
    toast("Product deleted", "info"); load();
  };
  const handleSave = async () => {
    if (!form.title || !form.sku) { toast("Title and SKU required", "error"); return; }
    if (modal === "add") { await axios.post(`${API}/products`, form); toast("Product added!", "success"); }
    else { await axios.put(`${API}/products/${form._id}`, form); toast("Product updated!", "success"); }
    setModal(null); load();
  };

  return (
    <>
      <CrudTable title="Products" subtitle={`${data.length} products`} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        columns={[
          { key: "sku", label: "SKU", mono: true },
          { key: "title", label: "Product Name" },
          { key: "category", label: "Category" },
          { key: "price", label: "Price (₹)", render: v => `₹${Number(v).toLocaleString()}` },
          { key: "stock", label: "Stock", render: (v, row) => <span style={{ color: v <= row.reorderLevel ? "var(--red)" : "var(--green)", fontWeight: 700 }}>{v}</span> },
        ]} />
      {modal && (
        <Modal title={modal === "add" ? "Add Product" : "Edit Product"} onClose={() => setModal(null)} onSave={handleSave}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">SKU</label><input className="form-input" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {["Electronics", "Accessories", "Furniture", "Stationery"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Stock</label><input className="form-input" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Reorder Level</label><input className="form-input" type="number" value={form.reorderLevel} onChange={e => setForm(f => ({ ...f, reorderLevel: e.target.value }))} /></div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
function CustomersPage() {
  const toast = useContext(ToastCtx);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = () => axios.get(`${API}/customers`).then(r => setData(r.data)).catch(() => toast("Failed to load", "error"));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ name: "", contact: "", email: "", phone: "", city: "" }); setModal("add"); };
  const openEdit = (row) => { setForm({ ...row }); setModal("edit"); };
  const handleDelete = async (row) => { await axios.delete(`${API}/customers/${row._id}`); toast("Deleted", "info"); load(); };
  const handleSave = async () => {
    if (!form.name) { toast("Name required", "error"); return; }
    if (modal === "add") { await axios.post(`${API}/customers`, form); toast("Customer added!", "success"); }
    else { await axios.put(`${API}/customers/${form._id}`, form); toast("Updated!", "success"); }
    setModal(null); load();
  };

  return (
    <>
      <CrudTable title="Customers" subtitle={`${data.length} customers`} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        columns={[
          { key: "name", label: "Company Name" },
          { key: "contact", label: "Contact Person" },
          { key: "email", label: "Email", mono: true },
          { key: "phone", label: "Phone", mono: true },
          { key: "city", label: "City" },
        ]} />
      {modal && (
        <Modal title={modal === "add" ? "Add Customer" : "Edit Customer"} onClose={() => setModal(null)} onSave={handleSave}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Contact Person</label><input className="form-input" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
        </Modal>
      )}
    </>
  );
}

// ─── SUPPLIERS ────────────────────────────────────────────────────────────────
function SuppliersPage() {
  const toast = useContext(ToastCtx);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = () => axios.get(`${API}/suppliers`).then(r => setData(r.data)).catch(() => toast("Failed to load", "error"));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ name: "", contact: "", email: "", phone: "", city: "" }); setModal("add"); };
  const openEdit = (row) => { setForm({ ...row }); setModal("edit"); };
  const handleDelete = async (row) => { await axios.delete(`${API}/suppliers/${row._id}`); toast("Deleted", "info"); load(); };
  const handleSave = async () => {
    if (!form.name) { toast("Name required", "error"); return; }
    if (modal === "add") { await axios.post(`${API}/suppliers`, form); toast("Supplier added!", "success"); }
    else { await axios.put(`${API}/suppliers/${form._id}`, form); toast("Updated!", "success"); }
    setModal(null); load();
  };

  return (
    <>
      <CrudTable title="Suppliers" subtitle={`${data.length} suppliers`} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        columns={[
          { key: "name", label: "Company Name" },
          { key: "contact", label: "Contact Person" },
          { key: "email", label: "Email", mono: true },
          { key: "phone", label: "Phone", mono: true },
          { key: "city", label: "City" },
        ]} />
      {modal && (
        <Modal title={modal === "add" ? "Add Supplier" : "Edit Supplier"} onClose={() => setModal(null)} onSave={handleSave}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Contact Person</label><input className="form-input" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
        </Modal>
      )}
    </>
  );
}

// ─── SALES ORDERS ─────────────────────────────────────────────────────────────
function SalesOrdersPage() {
  const toast = useContext(ToastCtx);
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const load = () => axios.get(`${API}/salesorders`).then(r => setData(r.data)).catch(() => {});
  useEffect(() => {
    load();
    axios.get(`${API}/customers`).then(r => setCustomers(r.data)).catch(() => {});
  }, []);

  const openAdd = () => {
    setForm({ orderId: `SO-${Date.now()}`, customer: "", date: new Date().toISOString().split("T")[0], status: "Pending", total: "", items: "" });
    setModal(true);
  };
  const handleSave = async () => {
    if (!form.customer) { toast("Customer required", "error"); return; }
    await axios.post(`${API}/salesorders`, form);
    toast("Sales order created!", "success"); setModal(false); load();
  };
  const handleStatus = async (row, status) => {
    await axios.put(`${API}/salesorders/${row._id}`, { ...row, status });
    toast(`Marked as ${status}!`, "success"); load();
  };
  const handleDelete = async (row) => { await axios.delete(`${API}/salesorders/${row._id}`); toast("Deleted", "info"); load(); };

  return (
    <>
      <CrudTable title="Sales Orders" subtitle={`${data.length} orders`} data={data} onAdd={openAdd}
        columns={[
          { key: "orderId", label: "Order ID", mono: true },
          { key: "customer", label: "Customer" },
          { key: "date", label: "Date", mono: true },
          { key: "items", label: "Items", mono: true },
          { key: "total", label: "Total (₹)", render: v => `₹${Number(v).toLocaleString()}` },
          { key: "status", label: "Status", badge: true },
        ]}
        actions={(row) => (
          <>
            <button className="btn btn-success btn-sm" onClick={() => handleStatus(row, "Delivered")}>✅</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>🗑️</button>
          </>
        )}
      />
      {modal && (
        <Modal title="Create Sales Order" onClose={() => setModal(false)} onSave={handleSave}>
          <div className="form-group"><label className="form-label">Customer</label>
            <select className="form-input" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {["Pending", "Processing", "Shipped", "Delivered"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Total (₹)</label><input className="form-input" type="number" value={form.total} onChange={e => setForm(f => ({ ...f, total: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Items</label><input className="form-input" type="number" value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} /></div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── PURCHASE ORDERS ──────────────────────────────────────────────────────────
function PurchaseOrdersPage() {
  const toast = useContext(ToastCtx);
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const load = () => axios.get(`${API}/purchaseorders`).then(r => setData(r.data)).catch(() => {});
  useEffect(() => {
    load();
    axios.get(`${API}/suppliers`).then(r => setSuppliers(r.data)).catch(() => {});
  }, []);

  const openAdd = () => {
    setForm({ orderId: `PO-${Date.now()}`, supplier: "", date: new Date().toISOString().split("T")[0], status: "Ordered", total: "", items: "" });
    setModal(true);
  };
  const handleSave = async () => {
    if (!form.supplier) { toast("Supplier required", "error"); return; }
    await axios.post(`${API}/purchaseorders`, form);
    toast("Purchase order created!", "success"); setModal(false); load();
  };
  const handleDelete = async (row) => { await axios.delete(`${API}/purchaseorders/${row._id}`); toast("Deleted", "info"); load(); };

  return (
    <>
      <CrudTable title="Purchase Orders" subtitle={`${data.length} orders`} data={data} onAdd={openAdd}
        columns={[
          { key: "orderId", label: "PO Number", mono: true },
          { key: "supplier", label: "Supplier" },
          { key: "date", label: "Date", mono: true },
          { key: "items", label: "Items", mono: true },
          { key: "total", label: "Total (₹)", render: v => `₹${Number(v).toLocaleString()}` },
          { key: "status", label: "Status", badge: true },
        ]}
        actions={(row) => (
          <>
            <button className="btn btn-success btn-sm" onClick={async () => { await axios.put(`${API}/purchaseorders/${row._id}`, { ...row, status: "Received" }); toast("Marked received!", "success"); load(); }}>✅</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>🗑️</button>
          </>
        )}
      />
      {modal && (
        <Modal title="Create Purchase Order" onClose={() => setModal(false)} onSave={handleSave}>
          <div className="form-group"><label className="form-label">Supplier</label>
            <select className="form-input" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))}>
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {["Ordered", "In Transit", "Received"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Total (₹)</label><input className="form-input" type="number" value={form.total} onChange={e => setForm(f => ({ ...f, total: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Items</label><input className="form-input" type="number" value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} /></div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── GRN ──────────────────────────────────────────────────────────────────────
function GRNPage() {
  const toast = useContext(ToastCtx);
  const [data, setData] = useState([]);
  const [pos, setPos] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const load = () => axios.get(`${API}/grns`).then(r => setData(r.data)).catch(() => {});
  useEffect(() => {
    load();
    axios.get(`${API}/purchaseorders`).then(r => setPos(r.data)).catch(() => {});
  }, []);

  const openAdd = () => {
    setForm({ grnId: `GRN-${Date.now()}`, poId: "", supplier: "", date: new Date().toISOString().split("T")[0], items: "", status: "Completed" });
    setModal(true);
  };
  const handleSave = async () => {
    if (!form.poId) { toast("PO required", "error"); return; }
    await axios.post(`${API}/grns`, form);
    toast("GRN created!", "success"); setModal(false); load();
  };
  const handleDelete = async (row) => { await axios.delete(`${API}/grns/${row._id}`); toast("Deleted", "info"); load(); };

  return (
    <>
      <CrudTable title="Goods Receipt Notes" subtitle={`${data.length} GRNs`} data={data} onAdd={openAdd} onDelete={handleDelete}
        columns={[
          { key: "grnId", label: "GRN ID", mono: true },
          { key: "poId", label: "PO Reference", mono: true },
          { key: "supplier", label: "Supplier" },
          { key: "date", label: "Date", mono: true },
          { key: "items", label: "Items", mono: true },
          { key: "status", label: "Status", badge: true },
        ]} />
      {modal && (
        <Modal title="Create GRN" onClose={() => setModal(false)} onSave={handleSave}>
          <div className="form-group"><label className="form-label">Purchase Order</label>
            <select className="form-input" value={form.poId} onChange={e => {
              const po = pos.find(p => p.orderId === e.target.value);
              setForm(f => ({ ...f, poId: e.target.value, supplier: po?.supplier || "" }));
            }}>
              <option value="">Select PO</option>
              {pos.map(p => <option key={p._id} value={p.orderId}>{p.orderId} — {p.supplier}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Supplier</label><input className="form-input" value={form.supplier} readOnly style={{ opacity: .6 }} /></div>
            <div className="form-group"><label className="form-label">Items Received</label><input className="form-input" type="number" value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Completed</option><option>Partial</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── INVOICES ─────────────────────────────────────────────────────────────────
function InvoicesPage() {
  const toast = useContext(ToastCtx);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const load = () => axios.get(`${API}/invoices`).then(r => setData(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ invoiceId: `INV-${Date.now()}`, soId: "", customer: "", date: new Date().toISOString().split("T")[0], due: "", amount: "", status: "Pending" });
    setModal(true);
  };
  const handleSave = async () => {
    if (!form.customer) { toast("Customer required", "error"); return; }
    await axios.post(`${API}/invoices`, form);
    toast("Invoice created!", "success"); setModal(false); load();
  };
  const handleDelete = async (row) => { await axios.delete(`${API}/invoices/${row._id}`); toast("Deleted", "info"); load(); };

  return (
    <>
      <CrudTable title="Invoices" subtitle={`${data.length} invoices`} data={data} onAdd={openAdd}
        columns={[
          { key: "invoiceId", label: "Invoice #", mono: true },
          { key: "customer", label: "Customer" },
          { key: "date", label: "Date", mono: true },
          { key: "due", label: "Due Date", mono: true },
          { key: "amount", label: "Amount (₹)", render: v => `₹${Number(v).toLocaleString()}` },
          { key: "status", label: "Status", badge: true },
        ]}
        actions={(row) => (
          <>
            <button className="btn btn-success btn-sm" onClick={async () => { await axios.put(`${API}/invoices/${row._id}`, { ...row, status: "Paid" }); toast("Marked paid!", "success"); load(); }}>✅ Paid</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>🗑️</button>
          </>
        )}
      />
      {modal && (
        <Modal title="Create Invoice" onClose={() => setModal(false)} onSave={handleSave}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Customer</label><input className="form-input" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Sales Order ID</label><input className="form-input" value={form.soId} onChange={e => setForm(f => ({ ...f, soId: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {["Pending", "Paid", "Overdue"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── USERS ────────────────────────────────────────────────────────────────────
function UsersPage() {
  const toast = useContext(ToastCtx);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = () => axios.get(`${API}/users`).then(r => setData(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ name: "", email: "", role: "Sales", status: "Active", joined: new Date().toISOString().split("T")[0] }); setModal("add"); };
  const openEdit = (row) => { setForm({ ...row }); setModal("edit"); };
  const handleDelete = async (row) => { await axios.delete(`${API}/users/${row._id}`); toast("User removed", "info"); load(); };
  const handleSave = async () => {
    if (!form.name || !form.email) { toast("Name and email required", "error"); return; }
    if (modal === "add") { await axios.post(`${API}/users`, form); toast("User added!", "success"); }
    else { await axios.put(`${API}/users/${form._id}`, form); toast("Updated!", "success"); }
    setModal(null); load();
  };

  return (
    <>
      <CrudTable title="User Management" subtitle={`${data.length} users`} data={data} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email", mono: true },
          { key: "role", label: "Role", badge: true },
          { key: "status", label: "Status", badge: true },
          { key: "joined", label: "Joined", mono: true },
        ]} />
      {modal && (
        <Modal title={modal === "add" ? "Add User" : "Edit User"} onClose={() => setModal(null)} onSave={handleSave}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Role</label>
              <select className="form-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {["Admin", "Sales", "Purchase", "Inventory"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────
const NAV = [
  { section: "Main", items: [{ id: "dashboard", label: "Dashboard", icon: "🏠" }] },
  { section: "Inventory", items: [{ id: "products", label: "Products", icon: "📦" }, { id: "grn", label: "Goods Receipt", icon: "📋" }] },
  { section: "CRM", items: [{ id: "customers", label: "Customers", icon: "👥" }, { id: "suppliers", label: "Suppliers", icon: "🏭" }] },
  { section: "Operations", items: [{ id: "sales", label: "Sales Orders", icon: "🛒" }, { id: "purchase", label: "Purchase Orders", icon: "🛍️" }, { id: "invoices", label: "Invoices", icon: "🧾" }] },
  { section: "Admin", items: [{ id: "users", label: "Users", icon: "👤" }] },
];

function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  const { user, logout } = useContext(AuthCtx);
  const toast = useContext(ToastCtx);
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">N</div>
        {!collapsed && <div><div className="logo-text">NexusERP</div><div className="logo-sub">v2.0 Enterprise</div></div>}
      </div>
      <nav className="nav">
        {NAV.map(s => (
          <div key={s.section} className="nav-section">
            {!collapsed && <div className="nav-label">{s.section}</div>}
            {s.items.map(item => (
              <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)} title={item.label}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-card" onClick={() => { logout(); toast("Logged out", "info"); }}>
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          {!collapsed && <div><div className="user-name">{user?.name}</div><div className="user-role">{user?.role} • Sign out</div></div>}
        </div>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppShell() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const titles = { dashboard: "Dashboard", products: "Products", customers: "Customers", suppliers: "Suppliers", sales: "Sales Orders", purchase: "Purchase Orders", grn: "Goods Receipt Notes", invoices: "Invoices", users: "User Management" };
  const pages = { dashboard: <Dashboard />, products: <ProductsPage />, customers: <CustomersPage />, suppliers: <SuppliersPage />, sales: <SalesOrdersPage />, purchase: <PurchaseOrdersPage />, grn: <GRNPage />, invoices: <InvoicesPage />, users: <UsersPage /> };

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main">
        <div className="topbar">
          <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>☰</button>
          <div className="topbar-title">{titles[page]}</div>
        </div>
        <div className="content">{pages[page]}</div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function App() {
  const { user } = useContext(AuthCtx);
  return user ? <AppShell /> : <LoginPage />;
}

export default function Root() {
  return (
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  );
}