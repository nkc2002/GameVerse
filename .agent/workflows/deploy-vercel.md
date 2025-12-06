---
description: Hướng dẫn deploy GameVerse lên Vercel
---

# Hướng dẫn Deploy GameVerse lên Vercel

## Yêu cầu trước khi bắt đầu

1. Tài khoản GitHub (để kết nối với Vercel)
2. Tài khoản Vercel (miễn phí tại https://vercel.com)
3. MongoDB Atlas (database cloud miễn phí tại https://www.mongodb.com/cloud/atlas)
4. Cloudinary account (cho upload ảnh, tại https://cloudinary.com)

---

## Phần 1: Chuẩn bị Repository

### 1. Khởi tạo Git repository (nếu chưa có)

```bash
git init
git add .
git commit -m "Initial commit for deployment"
```

### 2. Tạo repository trên GitHub

- Truy cập https://github.com/new
- Tạo repository mới (ví dụ: `gameverse`)
- Không chọn "Initialize with README" (vì đã có code)

### 3. Push code lên GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/gameverse.git
git branch -M main
git push -u origin main
```

---

## Phần 2: Deploy Backend lên Vercel

### 1. Cài đặt Vercel CLI (tùy chọn)

```bash
npm install -g vercel
```

### 2. Deploy Backend qua Vercel Dashboard

**Bước 2.1:** Truy cập https://vercel.com/dashboard

**Bước 2.2:** Click "Add New Project"

**Bước 2.3:** Import repository GitHub của bạn

**Bước 2.4:** Cấu hình project:

- **Framework Preset:** Other
- **Root Directory:** `backend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Bước 2.5:** Thêm Environment Variables (click "Environment Variables"):

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Lưu ý quan trọng:**

- `MONGODB_URI`: Lấy từ MongoDB Atlas (Database → Connect → Connect your application)
- `JWT_SECRET`: Tạo một chuỗi ngẫu nhiên dài và phức tạp
- `FRONTEND_URL`: Sẽ cập nhật sau khi deploy frontend

**Bước 2.6:** Click "Deploy"

**Bước 2.7:** Sau khi deploy thành công, copy URL backend (ví dụ: `https://gameverse-backend.vercel.app`)

### 3. Hoặc Deploy qua CLI

```bash
cd backend
vercel
```

Làm theo hướng dẫn trên terminal và thêm environment variables khi được yêu cầu.

---

## Phần 3: Deploy Frontend lên Vercel

### 1. Cập nhật Backend URL trong Frontend

**Bước 1.1:** Mở file `frontend/.env.production`

**Bước 1.2:** Cập nhật `VITE_API_BASE_URL` với URL backend vừa deploy:

```
VITE_API_BASE_URL=https://gameverse-backend.vercel.app/api
```

**Bước 1.3:** Commit thay đổi:

```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push
```

### 2. Deploy Frontend qua Vercel Dashboard

**Bước 2.1:** Truy cập https://vercel.com/dashboard

**Bước 2.2:** Click "Add New Project"

**Bước 2.3:** Import cùng repository GitHub

**Bước 2.4:** Cấu hình project:

- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Bước 2.5:** Thêm Environment Variables:

```
VITE_API_BASE_URL=https://gameverse-backend.vercel.app/api
```

**Bước 2.6:** Click "Deploy"

**Bước 2.7:** Copy URL frontend sau khi deploy thành công

### 3. Hoặc Deploy qua CLI

```bash
cd frontend
vercel
```

---

## Phần 4: Cập nhật CORS và Frontend URL

### 1. Cập nhật FRONTEND_URL trong Backend

**Bước 1.1:** Truy cập Vercel Dashboard → Backend Project → Settings → Environment Variables

**Bước 1.2:** Cập nhật `FRONTEND_URL` với URL frontend vừa deploy:

```
FRONTEND_URL=https://gameverse-frontend.vercel.app
```

**Bước 1.3:** Redeploy backend:

- Vào tab "Deployments"
- Click vào deployment mới nhất
- Click "..." → "Redeploy"

---

## Phần 5: Cấu hình MongoDB Atlas

### 1. Whitelist Vercel IP

**Bước 1.1:** Truy cập MongoDB Atlas Dashboard

**Bước 1.2:** Network Access → Add IP Address

**Bước 1.3:** Chọn "Allow Access from Anywhere" (0.0.0.0/0)

- Lưu ý: Đây là cách đơn giản nhất cho Vercel vì IP động

### 2. Tạo Database User

**Bước 2.1:** Database Access → Add New Database User

**Bước 2.2:** Tạo username và password mạnh

**Bước 2.3:** Cấp quyền "Read and write to any database"

---

## Phần 6: Kiểm tra Deployment

### 1. Test Backend API

Truy cập: `https://your-backend-url.vercel.app/api/health` (nếu có health check endpoint)

### 2. Test Frontend

Truy cập: `https://your-frontend-url.vercel.app`

### 3. Test Full Flow

- Đăng ký tài khoản mới
- Đăng nhập
- Tạo bài post
- Upload ảnh
- Kiểm tra các chức năng khác

---

## Phần 7: Cấu hình Custom Domain (Tùy chọn)

### 1. Thêm Domain cho Frontend

**Bước 1.1:** Vercel Dashboard → Frontend Project → Settings → Domains

**Bước 1.2:** Nhập domain của bạn (ví dụ: `gameverse.com`)

**Bước 1.3:** Làm theo hướng dẫn để cấu hình DNS

### 2. Thêm Domain cho Backend

**Bước 2.1:** Vercel Dashboard → Backend Project → Settings → Domains

**Bước 2.2:** Nhập subdomain (ví dụ: `api.gameverse.com`)

**Bước 2.3:** Cấu hình DNS

**Bước 2.4:** Cập nhật lại `VITE_API_BASE_URL` trong frontend và `FRONTEND_URL` trong backend

---

## Troubleshooting

### Lỗi 500 Internal Server Error

- Kiểm tra logs: Vercel Dashboard → Project → Deployments → Click deployment → View Function Logs
- Kiểm tra environment variables đã đúng chưa
- Kiểm tra MongoDB connection string

### Lỗi CORS

- Kiểm tra `FRONTEND_URL` trong backend environment variables
- Kiểm tra CORS configuration trong backend code

### Build Failed

- Kiểm tra logs trong Vercel
- Đảm bảo `package.json` có đúng build scripts
- Kiểm tra TypeScript errors

### API không kết nối được

- Kiểm tra `VITE_API_BASE_URL` trong frontend
- Kiểm tra Network tab trong browser DevTools
- Đảm bảo backend đã deploy thành công

---

## Lưu ý quan trọng

1. **Environment Variables**: Không commit file `.env` lên Git. Chỉ commit `.env.example`

2. **MongoDB Atlas**: Sử dụng MongoDB Atlas thay vì MongoDB local

3. **Cloudinary**: Cấu hình Cloudinary cho upload ảnh trong production

4. **JWT Secret**: Sử dụng JWT secret mạnh và khác với development

5. **Auto Deploy**: Vercel tự động deploy khi bạn push code lên GitHub

6. **Free Tier Limits**:
   - Vercel Free: 100GB bandwidth/tháng
   - MongoDB Atlas Free: 512MB storage
   - Cloudinary Free: 25GB storage, 25GB bandwidth/tháng

---

## Các lệnh hữu ích

```bash
# Deploy lại project
vercel --prod

# Xem logs
vercel logs

# Xem danh sách deployments
vercel ls

# Remove project
vercel remove
```

---

## Tài liệu tham khảo

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Cloudinary: https://cloudinary.com/documentation
