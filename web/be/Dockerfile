FROM golang:1.25.4 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY ./main.go ./
COPY ./internal/ ./internal/

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /go-backend

FROM node:24-bullseye AS build-release-stage

# RUN apk add --no-cache ca-certificates
RUN apt-get update && apt-get install -y \
    ca-certificates

WORKDIR /molrender

# RUN apk add --no-cache \
#     python3 \
#     make \
#     g++ \
#     pkgconf \
#     xorgproto \
#     libx11-dev \
#     libxext-dev \
#     libxi-dev

RUN apt-get update && apt-get install -y \
    python3 \
    python-is-python3 \
    make \
    g++ \
    pkg-config \
    libx11-dev \
    libxext-dev \
    libgl1-mesa-dev \
    libxi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY ./molrender/package*.json ./
RUN npm install

WORKDIR /

COPY --from=build-stage /go-backend /go-backend
COPY ./.env-docker ./.env

ENTRYPOINT ["/go-backend"]
