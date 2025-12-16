# ===============================
# 1단계: 빌드 스테이지
# ===============================
FROM gradle:jdk21-jammy AS builder

WORKDIR /app

# Gradle 관련 파일 복사 (Groovy DSL)
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 실행 권한 부여
RUN chmod +x ./gradlew

# 의존성 캐시
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사
COPY src src

# 빌드
RUN ./gradlew build -x test --no-daemon


# ===============================
# 2단계: 실행 스테이지
# ===============================
FROM eclipse-temurin:21-jre

WORKDIR /app

# 빌드된 JAR 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]