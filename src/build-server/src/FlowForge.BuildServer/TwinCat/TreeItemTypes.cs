// Copyright (c) 2026 Qubernetic (Biró, Csaba Attila)
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace FlowForge.BuildServer.TwinCat;

/// <summary>
/// TwinCAT tree item subtype constants for ITcSmTreeItem.CreateChild().
/// Values from Beckhoff InfoSys Automation Interface documentation.
/// </summary>
public static class TreeItemTypes
{
    public const int Pou = 604;
    public const int Gvl = 615;
    public const int DutStruct = 606;
    public const int DutEnum = 606;
    public const int Itf = 618;

    public static class PouType
    {
        public const string Program = "Program";
        public const string FunctionBlock = "FunctionBlock";
        public const string Function = "Function";
    }

    public static class TreePaths
    {
        public const string PlcProject = "TIPC^PLC Project";
        public const string Pous = "TIPC^PLC Project^POUs";
        public const string Gvls = "TIPC^PLC Project^GVLs";
        public const string Duts = "TIPC^PLC Project^DUTs";
        public const string Io = "TIID";
        public const string Realtime = "TIRT";
    }
}
