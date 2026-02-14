FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/FlowForge.MonitorServer/FlowForge.MonitorServer.csproj", "src/FlowForge.MonitorServer/"]
RUN dotnet restore "src/FlowForge.MonitorServer/FlowForge.MonitorServer.csproj"
COPY . .
WORKDIR "/src/src/FlowForge.MonitorServer"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "FlowForge.MonitorServer.dll"]
