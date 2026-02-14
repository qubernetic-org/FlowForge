FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/FlowForge.Backend.Api/FlowForge.Backend.Api.csproj", "src/FlowForge.Backend.Api/"]
RUN dotnet restore "src/FlowForge.Backend.Api/FlowForge.Backend.Api.csproj"
COPY . .
WORKDIR "/src/src/FlowForge.Backend.Api"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "FlowForge.Backend.Api.dll"]
