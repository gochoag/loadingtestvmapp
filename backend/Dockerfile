FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOMAXPROCS=1 GOMEMLIMIT=256MiB go build -p=1 -trimpath -ldflags="-s -w -buildid=" -o server .

FROM alpine:3.22
WORKDIR /app
COPY --from=builder /app/server ./server
ENV APP_ENV=production
EXPOSE 8080
CMD ["./server"]
