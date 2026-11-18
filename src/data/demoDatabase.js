export const DEMO_ACCOUNT = { email: 'demo@dashboard.local', password: 'Dashboard123!' };

export const DEMO_DATABASE = {
  customers: [
    { id: 1, name: 'Amina Trading Co.', email: 'amina@trading.rw', phone: '+250 788 123 456', joined: '2026-10-12', status: 'Active' },
    { id: 2, name: 'Kivu Creative Studio', email: 'hello@kivu.rw', phone: '+250 783 221 900', joined: '2026-10-08', status: 'Active' },
    { id: 3, name: 'Greenline Supplies', email: 'orders@greenline.rw', phone: '+250 790 412 220', joined: '2026-09-28', status: 'Active' },
    { id: 4, name: 'Urban Market', email: 'team@urbanmarket.rw', phone: '+250 788 330 119', joined: '2026-09-18', status: 'Archived' },
    { id: 5, name: 'Nova Concepts', email: 'nova@concepts.rw', phone: '+250 781 900 223', joined: '2026-09-10', status: 'Active' }
  ],
  sales: [
    { id: 1001, customer: 'Amina Trading Co.', description: 'Product order #1001', date: '2026-11-18', amount: 125000, status: 'Paid' },
    { id: 1002, customer: 'Kivu Creative Studio', description: 'Monthly service package', date: '2026-11-17', amount: 280000, status: 'Pending' },
    { id: 1003, customer: 'Greenline Supplies', description: 'Wholesale supplies', date: '2026-11-15', amount: 195000, status: 'Paid' },
    { id: 1004, customer: 'Nova Concepts', description: 'Consultation and setup', date: '2026-11-13', amount: 85000, status: 'Pending' },
    { id: 1005, customer: 'Amina Trading Co.', description: 'Additional inventory', date: '2026-11-10', amount: 340000, status: 'Paid' }
  ],
  tasks: [
    { id: 1, title: 'Follow up on pending invoice', due: '2026-11-20', priority: 'High', done: false },
    { id: 2, title: 'Prepare monthly sales report', due: '2026-11-22', priority: 'Medium', done: false },
    { id: 3, title: 'Review new customer requests', due: '2026-11-19', priority: 'Low', done: true },
    { id: 4, title: 'Update product catalogue', due: '2026-11-25', priority: 'Medium', done: false }
  ]
};
