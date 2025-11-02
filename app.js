// ==================== STORAGE LAYER ABSTRACTION ====================
const STORAGE_KEY = 'ticketManagementData';
const SCHEMA_VERSION = 1;

class TicketStorage {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            this.saveData({
                version: SCHEMA_VERSION,
                tickets: [],
                initialized: false
            });
        }
        // Initialize demo data if first run
        const data = this.getData();
        if (!data.initialized) {
            this.initializeDemoData();
        }
    }

    getData() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (e) {
            console.error('Error parsing storage data:', e);
            return { version: SCHEMA_VERSION, tickets: [], initialized: false };
        }
    }

    saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    getTickets() {
        return this.getData().tickets || [];
    }

    saveTickets(tickets) {
        const data = this.getData();
        data.tickets = tickets;
        this.saveData(data);
    }

    addTicket(ticket) {
        const tickets = this.getTickets();
        tickets.push(ticket);
        this.saveTickets(tickets);
    }

    updateTicket(ticketId, updates) {
        const tickets = this.getTickets();
        const index = tickets.findIndex(t => t.id === ticketId);
        if (index !== -1) {
            tickets[index] = { ...tickets[index], ...updates };
            this.saveTickets(tickets);
            return tickets[index];
        }
        return null;
    }

    deleteTicket(ticketId) {
        const tickets = this.getTickets();
        const filtered = tickets.filter(t => t.id !== ticketId);
        this.saveTickets(filtered);
    }

    clearAll() {
        this.saveData({
            version: SCHEMA_VERSION,
            tickets: [],
            initialized: true
        });
    }

    exportJSON() {
        return JSON.stringify(this.getData(), null, 2);
    }

    importJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            // Validate data structure
            if (data.tickets && Array.isArray(data.tickets)) {
                this.saveData(data);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }

    initializeDemoData() {
        const now = new Date();
        const demoTickets = [
            {
                id: 't-' + Date.now() + '-1',
                name: 'Anh Minh',
                phone: '0909123456',
                description: 'Máy lạnh không lạnh, chạy kêu to',
                address: 'Phòng 302, Tòa A',
                images: [],
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Completed',
                assignedTo: 'Quang',
                inProgressAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
                completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
                rootCause: 'Thiếu gas, lọc bẩn',
                actionsTaken: 'Đổ gas R32, vệ sinh lọc, kiểm tra toàn bộ hệ thống',
                fee: 450000
            },
            {
                id: 't-' + Date.now() + '-2',
                name: 'Chị Hoa',
                phone: '0912345678',
                description: 'Ống nước bị rò rỉ dưới bồn rửa',
                address: 'Nhà 15, Ngõ 123',
                images: [],
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Completed',
                assignedTo: 'Nhật',
                inProgressAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 1800000).toISOString(),
                completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 5400000).toISOString(),
                rootCause: 'Ống nối bị lỏng, ron cao su hư',
                actionsTaken: 'Thay ron cao su mới, vặn chặt ống nối',
                fee: 150000
            },
            {
                id: 't-' + Date.now() + '-3',
                name: 'Anh Tuấn',
                phone: '0923456789',
                description: 'Tivi không lên hình, có tiếng',
                address: 'Căn 506, Chung cư B',
                images: [],
                createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
                status: 'In Progress',
                assignedTo: 'Hiếu',
                inProgressAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                rootCause: '',
                actionsTaken: '',
                fee: 0
            },
            {
                id: 't-' + Date.now() + '-4',
                name: 'Chị Lan',
                phone: '0934567890',
                description: 'Máy giặt không vắt, chỉ giặt được',
                address: 'Số 8, Đường XYZ',
                images: [],
                createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
                status: 'Waiting',
                assignedTo: '',
                inProgressAt: null,
                completedAt: null,
                rootCause: '',
                actionsTaken: '',
                fee: 0
            },
            {
                id: 't-' + Date.now() + '-5',
                name: 'Anh Dũng',
                phone: '0945678901',
                description: 'Quạt trần quay chậm, rung lắc',
                address: 'Phòng 102',
                images: [],
                createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
                status: 'Waiting',
                assignedTo: '',
                inProgressAt: null,
                completedAt: null,
                rootCause: '',
                actionsTaken: '',
                fee: 0
            }
        ];

        this.saveData({
            version: SCHEMA_VERSION,
            tickets: demoTickets,
            initialized: true
        });
    }
}

// Initialize storage
const storage = new TicketStorage();

// ==================== UTILITY FUNCTIONS ====================
function generateTicketId() {
    return 't-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function formatDateTime(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

function getStatusBadge(status) {
    const badges = {
        'Waiting': '<span class="status-badge status-waiting">Chờ xử lý</span>',
        'In Progress': '<span class="status-badge status-inprogress">Đang xử lý</span>',
        'Completed': '<span class="status-badge status-completed">Đã hoàn thành</span>'
    };
    return badges[status] || status;
}

// ==================== IMAGE HANDLING ====================
let pendingImages = [];

document.getElementById('ticketImages').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    const container = document.getElementById('imagePreviewContainer');

    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const dataUrl = event.target.result;
                pendingImages.push(dataUrl);

                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.innerHTML = `
                    <img src="${dataUrl}" alt="Preview">
                    <button type="button" class="image-preview-remove" onclick="removeImage(${pendingImages.length - 1})">×</button>
                `;
                container.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });

    // Reset input
    e.target.value = '';
});

function removeImage(index) {
    pendingImages.splice(index, 1);
    renderImagePreviews();
}

function renderImagePreviews() {
    const container = document.getElementById('imagePreviewContainer');
    container.innerHTML = '';
    pendingImages.forEach((dataUrl, index) => {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <img src="${dataUrl}" alt="Preview">
            <button type="button" class="image-preview-remove" onclick="removeImage(${index})">×</button>
        `;
        container.appendChild(preview);
    });
}

// ==================== TAB NAVIGATION ====================
function showTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update sections
    document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    // Render views
    if (tabName === 'ktv') {
        populateKTVFilters();
        renderKTVView();
    } else if (tabName === 'admin') {
        populateAdminFilters();
        renderAdminView();
        renderStatistics();
    } else if (tabName === 'export') {
        updateStorageInfo();
    }
}

// ==================== CREATE TICKET ====================
document.getElementById('createTicketForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const ticket = {
        id: generateTicketId(),
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        description: document.getElementById('issueDescription').value.trim(),
        address: document.getElementById('customerAddress').value.trim(),
        images: [...pendingImages],
        createdAt: new Date().toISOString(),
        status: 'Waiting',
        assignedTo: '',
        inProgressAt: null,
        completedAt: null,
        rootCause: '',
        actionsTaken: '',
        fee: 0
    };

    storage.addTicket(ticket);

    // Reset form
    this.reset();
    pendingImages = [];
    document.getElementById('imagePreviewContainer').innerHTML = '';

    alert('✓ Đã tạo phiếu công việc thành công!\nMã phiếu: ' + ticket.id);
});

// ==================== KTV VIEW ====================
const KTV_NAMES = ['Quang', 'Nhựt', 'Nhật', 'Hiếu', 'An'];

function populateKTVFilters() {
    const select = document.getElementById('ktvNameFilter');
    const currentValue = select.value;
    select.innerHTML = '<option value="all">Tất cả</option>';
    KTV_NAMES.forEach(name => {
        select.innerHTML += `<option value="${name}">${name}</option>`;
    });
    select.value = currentValue;
}

function renderKTVView() {
    const tickets = storage.getTickets();
    const statusFilter = document.getElementById('ktvStatusFilter').value;
    const ktvFilter = document.getElementById('ktvNameFilter').value;

    let filtered = tickets;
    if (statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === statusFilter);
    }
    if (ktvFilter !== 'all') {
        filtered = filtered.filter(t => t.assignedTo === ktvFilter);
    }

    // Sort by status priority and date
    const statusPriority = { 'Waiting': 1, 'In Progress': 2, 'Completed': 3 };
    filtered.sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
            return statusPriority[a.status] - statusPriority[b.status];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const container = document.getElementById('ktvTicketGrid');

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">Không có phiếu công việc nào</div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(ticket => `
        <div class="ticket-card" onclick="openTicketModal('${ticket.id}')">
            <div class="ticket-card-header">
                <div class="ticket-id">${ticket.id}</div>
                ${getStatusBadge(ticket.status)}
            </div>
            <div class="ticket-info">
                <div class="ticket-info-row">
                    <span class="ticket-info-label">Khách hàng:</span>
                    <span class="ticket-info-value">${ticket.name}</span>
                </div>
                <div class="ticket-info-row">
                    <span class="ticket-info-label">SĐT:</span>
                    <span class="ticket-info-value">${ticket.phone}</span>
                </div>
                <div class="ticket-info-row">
                    <span class="ticket-info-label">Địa chỉ:</span>
                    <span class="ticket-info-value">${ticket.address || '-'}</span>
                </div>
                <div class="ticket-info-row">
                    <span class="ticket-info-label">KTV:</span>
                    <span class="ticket-info-value">${ticket.assignedTo || '-'}</span>
                </div>
                <div class="ticket-info-row">
                    <span class="ticket-info-label">Thời gian:</span>
                    <span class="ticket-info-value">${formatDateTime(ticket.createdAt)}</span>
                </div>
            </div>
            <div class="ticket-description">
                ${ticket.description}
            </div>
        </div>
    `).join('');
}

// ==================== ADMIN VIEW ====================
function populateAdminFilters() {
    const select = document.getElementById('adminKTVFilter');
    const currentValue = select.value;
    select.innerHTML = '<option value="all">Tất cả</option>';
    KTV_NAMES.forEach(name => {
        select.innerHTML += `<option value="${name}">${name}</option>`;
    });
    select.value = currentValue;
}

function renderAdminView() {
    const tickets = storage.getTickets();
    const searchQuery = document.getElementById('adminSearchQuery').value.toLowerCase();
    const statusFilter = document.getElementById('adminStatusFilter').value;
    const ktvFilter = document.getElementById('adminKTVFilter').value;
    const dateFrom = document.getElementById('adminDateFrom').value;
    const dateTo = document.getElementById('adminDateTo').value;

    let filtered = tickets;

    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(searchQuery) ||
            t.phone.includes(searchQuery) ||
            t.id.toLowerCase().includes(searchQuery)
        );
    }

    // Status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === statusFilter);
    }

    // KTV filter
    if (ktvFilter !== 'all') {
        filtered = filtered.filter(t => t.assignedTo === ktvFilter);
    }

    // Date range filter
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(t => new Date(t.createdAt) >= fromDate);
    }
    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(t => new Date(t.createdAt) <= toDate);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const tbody = document.getElementById('adminTableBody');

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center; padding: 40px; color: #999;">
                    Không tìm thấy phiếu công việc nào
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(ticket => `
        <tr>
            <td>${ticket.id}</td>
            <td>${ticket.name}</td>
            <td>${ticket.phone}</td>
            <td>${ticket.address || '-'}</td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ticket.description}">
                ${ticket.description}
            </td>
            <td>${getStatusBadge(ticket.status)}</td>
            <td>${ticket.assignedTo || '-'}</td>
            <td>${formatDateTime(ticket.createdAt)}</td>
            <td>${formatDateTime(ticket.completedAt)}</td>
            <td>${formatCurrency(ticket.fee)}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="openTicketModal('${ticket.id}'); event.stopPropagation();">
                    Chi tiết
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTicket('${ticket.id}'); event.stopPropagation();">
                    Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

function renderStatistics() {
    const tickets = storage.getTickets();

    const total = tickets.length;
    const waiting = tickets.filter(t => t.status === 'Waiting').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const completed = tickets.filter(t => t.status === 'Completed').length;
    const revenue = tickets
        .filter(t => t.status === 'Completed')
        .reduce((sum, t) => sum + (t.fee || 0), 0);

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statWaiting').textContent = waiting;
    document.getElementById('statInProgress').textContent = inProgress;
    document.getElementById('statCompleted').textContent = completed;
    document.getElementById('statRevenue').textContent = formatCurrency(revenue) + 'đ';
}

// ==================== TICKET MODAL ====================
function openTicketModal(ticketId) {
    const tickets = storage.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const modal = document.getElementById('ticketModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');

    modalTitle.textContent = 'Chi tiết Phiếu - ' + ticket.id;

    // Render ticket details
    let imagesHTML = '';
    if (ticket.images && ticket.images.length > 0) {
        imagesHTML = `
            <div class="form-group">
                <label>Hình ảnh</label>
                <div class="image-gallery">
                    ${ticket.images.map(img => `<img src="${img}" alt="Ticket image" onclick="window.open(this.src, '_blank')">`).join('')}
                </div>
            </div>
        `;
    }

    modalBody.innerHTML = `
        <div class="form-group">
            <label>Trạng thái</label>
            <div>${getStatusBadge(ticket.status)}</div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Khách hàng</label>
                <input type="text" value="${ticket.name}" readonly>
            </div>
            <div class="form-group">
                <label>Số điện thoại</label>
                <input type="text" value="${ticket.phone}" readonly>
            </div>
        </div>
        <div class="form-group">
            <label>Địa chỉ</label>
            <input type="text" value="${ticket.address || '-'}" readonly>
        </div>
        <div class="form-group">
            <label>Mô tả vấn đề</label>
            <textarea readonly>${ticket.description}</textarea>
        </div>
        ${imagesHTML}
        <div class="form-row">
            <div class="form-group">
                <label>Thời gian tạo</label>
                <input type="text" value="${formatDateTime(ticket.createdAt)}" readonly>
            </div>
            <div class="form-group">
                <label>Hoàn thành lúc</label>
                <input type="text" value="${formatDateTime(ticket.completedAt)}" readonly>
            </div>
        </div>
        <hr style="margin: 20px 0; border: 1px solid #e0e0e0;">
        <h3 style="margin-bottom: 15px; color: #667eea;">Thông tin Kỹ thuật</h3>
        <div class="form-group">
            <label>KTV được giao</label>
            <select id="modalAssignedTo" ${ticket.status === 'Completed' ? 'disabled' : ''}>
                <option value="">-- Chưa giao --</option>
                ${KTV_NAMES.map(name => `<option value="${name}" ${ticket.assignedTo === name ? 'selected' : ''}>${name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Trạng thái xử lý</label>
            <select id="modalStatus" ${ticket.status === 'Completed' ? 'disabled' : ''}>
                <option value="Waiting" ${ticket.status === 'Waiting' ? 'selected' : ''}>Chờ xử lý</option>
                <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>Đang xử lý</option>
                <option value="Completed" ${ticket.status === 'Completed' ? 'selected' : ''}>Đã hoàn thành</option>
            </select>
        </div>
        <div class="form-group">
            <label>Nguyên nhân / Vấn đề phát hiện</label>
            <textarea id="modalRootCause" ${ticket.status === 'Completed' ? 'readonly' : ''}>${ticket.rootCause}</textarea>
        </div>
        <div class="form-group">
            <label>Hành động đã thực hiện</label>
            <textarea id="modalActionsTaken" ${ticket.status === 'Completed' ? 'readonly' : ''}>${ticket.actionsTaken}</textarea>
        </div>
        <div class="form-group">
            <label>Phí dịch vụ (VNĐ)</label>
            <input type="number" id="modalFee" value="${ticket.fee}" ${ticket.status === 'Completed' ? 'readonly' : ''}>
        </div>
    `;

    // Render footer buttons
    if (ticket.status === 'Completed') {
        modalFooter.innerHTML = `
            <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
        `;
    } else {
        modalFooter.innerHTML = `
            <button class="btn btn-primary" onclick="saveTicketChanges('${ticket.id}')">💾 Lưu thay đổi</button>
            <button class="btn btn-danger" onclick="closeModal()">Hủy</button>
        `;
    }

    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('ticketModal').classList.remove('show');
}

function saveTicketChanges(ticketId) {
    const assignedTo = document.getElementById('modalAssignedTo').value;
    const newStatus = document.getElementById('modalStatus').value;
    const rootCause = document.getElementById('modalRootCause').value;
    const actionsTaken = document.getElementById('modalActionsTaken').value;
    const fee = parseInt(document.getElementById('modalFee').value) || 0;

    const tickets = storage.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    const oldStatus = ticket.status;

    const updates = {
        assignedTo,
        status: newStatus,
        rootCause,
        actionsTaken,
        fee
    };

    // Set timestamps
    if (oldStatus === 'Waiting' && newStatus === 'In Progress') {
        updates.inProgressAt = new Date().toISOString();
    }
    if (newStatus === 'Completed' && oldStatus !== 'Completed') {
        updates.completedAt = new Date().toISOString();
        if (!updates.inProgressAt) {
            updates.inProgressAt = new Date().toISOString();
        }
    }

    storage.updateTicket(ticketId, updates);

    alert('✓ Đã lưu thay đổi thành công!');
    closeModal();

    // Refresh current view
    const activeSection = document.querySelector('section.active');
    if (activeSection.id === 'ktv') {
        renderKTVView();
    } else if (activeSection.id === 'admin') {
        renderAdminView();
        renderStatistics();
    }
}

function deleteTicket(ticketId) {
    if (!confirm('Bạn có chắc chắn muốn xóa phiếu này?\n\nThao tác này không thể hoàn tác!')) {
        return;
    }

    storage.deleteTicket(ticketId);
    alert('✓ Đã xóa phiếu thành công!');

    renderAdminView();
    renderStatistics();
}

// ==================== EXPORT / IMPORT ====================
function exportData() {
    const jsonData = storage.exportJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✓ Đã xuất dữ liệu thành công!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!confirm('CẢNH BÁO: Nhập dữ liệu sẽ ghi đè lên tất cả dữ liệu hiện tại!\n\nBạn có chắc chắn muốn tiếp tục?')) {
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonString = e.target.result;
            const success = storage.importJSON(jsonString);

            if (success) {
                alert('✓ Đã nhập dữ liệu thành công!');
                updateStorageInfo();
                renderAdminView();
                renderStatistics();
            } else {
                alert('❌ Lỗi: File không đúng định dạng!');
            }
        } catch (error) {
            alert('❌ Lỗi khi đọc file: ' + error.message);
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (!confirm('CẢNH BÁO: Bạn sắp xóa TẤT CẢ dữ liệu!\n\nThao tác này KHÔNG THỂ hoàn tác!\n\nBạn có CHẮC CHẮN muốn tiếp tục?')) {
        return;
    }

    if (!confirm('Xác nhận lần cuối: XÓA TẤT CẢ DỮ LIỆU?')) {
        return;
    }

    storage.clearAll();
    alert('✓ Đã xóa tất cả dữ liệu!');
    updateStorageInfo();
}

function updateStorageInfo() {
    const data = storage.getData();
    document.getElementById('schemaVersion').textContent = data.version;
    document.getElementById('totalTicketsInfo').textContent = data.tickets.length;

    const jsonString = JSON.stringify(data);
    const bytes = new Blob([jsonString]).size;
    let sizeText;
    if (bytes < 1024) {
        sizeText = bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
        sizeText = (bytes / 1024).toFixed(2) + ' KB';
    } else {
        sizeText = (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    document.getElementById('storageSize').textContent = sizeText;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    document.getElementById('ticketModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Initialize first view
    renderKTVView();
});
