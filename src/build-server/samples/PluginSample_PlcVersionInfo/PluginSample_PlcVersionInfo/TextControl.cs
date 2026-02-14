using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TCatSysManagerLib;
using EnvDTE;
using System.Xml;
using System.IO;
using System.Xml.XPath;

/* ================================================================================================================================================================================================================================================================================================================
   Disclaimer
   ================================================================================================================================================================================================================================================================================================================
  This publication contains statements about the suitability of our products for certain areas of application. These statements are based on typical features of our products. 
  The examples shown in this publication are for demonstration purposes only. The information provided herein should not be regarded as specific operation characteristics. 
  It is incumbent on the customer to check and decide whether a product is suitable for use in a particular application. We do not give any warranty that the source code which is made available with this publication is complete or accurate. 
  THE SAMPLE CODE CONTAINED IN THIS PUBLICATION IS PROVIDED “AS IS” WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED, IMPLIED OR STATUTORY, INCLUDING WITHOUT LIMITATION, ANY WARRANTY WITH RESPECT TO NON-INFRINGEMENT, FREEDOM FROM PROPRIETARY RIGHTS OF THIRD PARTIES OR FITNESS FOR ANY PARTICULAR PURPOSE. 
  This publication may be changed from time to time without prior notice. No liability is assumed for errors and/or omissions. Our products are described in detail in our data sheets and documentations. 
  Product-specific warnings and cautions must be observed. For the latest version of our data sheets and documentations visit our website (www.beckhoff.de). 

  © Beckhoff Automation GmbH, June 2014
  The reproduction, distribution and utilization of this document as well as the communication of its contents to others without express authorization is prohibited. Offenders will be held liable for the payment of damages. All rights reserved in the event of the grant of a patent, utility model or design.
  ================================================================================================================================================================================================================================================================================================================ */

namespace PluginSample_PlcVersionInfo
{
    class TextControl
    {
        public TextControl()
        { }       
       
        public void activate(DTE dte, String Version, String Author, VersionInfo ui)
        {
            bool errorWhileSetting = false;
            dynamic sysMan;
            
            try
            {
                /* =============================================================
                 *  Register message filter
                 * ============================================================= */
                MessageFilter.Register();

                /* =============================================================
                 *  Prepare Visual Studio instance
                 * ============================================================= */
                dte.SuppressUI = false;
                dte.MainWindow.Visible = true;

                /* =============================================================
                 * Open the TwinCAT XAE solution file. Use dynamic typing.
                 * ============================================================= */
                dynamic sol = dte.Solution;           

                /* =============================================================
                 * Get the first project within the solution
                 * ============================================================= */
                dynamic pro = sol.Projects.Item(1);
                
                /* =============================================================
                 * Create an AutomationInterface object
                 * ============================================================= */
                sysMan = pro.Object;          
            
                /* =============================================================
                 * Navigate to PLC node and get first PLC project.
                 * If all PLC projects should be used, you need to iterate through
                 * the all PLC projects, e.g. by using a foreach-statement.
                 * ============================================================= */
                ITcSmTreeItem newPlc = sysMan.LookupTreeItem("TIPC");
                ITcSmTreeItem newPlcProject = newPlc.get_Child(1);

                /* Retrieve PLC project name and navigate to PLC project node. */
                string projectName = newPlcProject.Name;                               
                string plcProjectName = string.Format("TIPC^{0}^{0} Project", projectName);
                ITcSmTreeItem plcItems = sysMan.LookupTreeItem(plcProjectName);               

                /* Iterate over all items in folder "POUs". */
                foreach (ITcSmTreeItem item in plcItems)
                {
                    if (item.Name.Equals("POUs"))
                    {
                        foreach (ITcSmTreeItem subItem in item)
                        {
                            /* Check if found item is a POU. Only then check for version information. */
                            if (IsPOU(subItem))
                            {
                                ui.Text = "Setting version information on " + subItem.Name;

                                bool bVersionFound = false;
                                bool bAuthorFound = false;

                                /* Cast to more specific ITcPlcPou interface. */
                                ITcPlcPou newSubItem = (ITcPlcPou)subItem;

                                /* Cast to ITcPlcDeclaration and ITcPlcImplementation to read/write PLC code. */
                                ITcPlcDeclaration newItemDeclaration = (ITcPlcDeclaration)newSubItem;
                                ITcPlcImplementation newItemImplementation = (ITcPlcImplementation)newSubItem;

                                /* Retrieve PLC code from declaration area of POU. Search for version information tags "AUTHOR" and "VERSION".
                                 * If found, replace with new strings. If not found, add these tags in a VAR_CONSTANT area.  */
                                string declarationText = newItemDeclaration.DeclarationText;
                                string[] arrText = declarationText.Split(new string[] {"\n"}, StringSplitOptions.RemoveEmptyEntries);

                                for (int i = 0; i < arrText.Length; i++)
                                {
                                    if (arrText[i].Contains("VERSION"))
                                    {
                                        arrText[i] = string.Format("\tVERSION : STRING := '{0}';", Version);
                                        bVersionFound = true;
                                    }
                                    else if (arrText[i].Contains("AUTHOR"))
                                    {
                                        arrText[i] = string.Format("\tAUTHOR : STRING := '{0}';", Author);
                                        bAuthorFound = true;
                                    }
                                    else if (i == arrText.Length - 1 & !bVersionFound & !bAuthorFound)
                                    {
                                        declarationText += string.Format("\nVAR CONSTANT\n\tVERSION : STRING := '{0}';\n\t AUTHOR : STRING := '{1}'\nEND_VAR", Version, Author);
                                        newItemDeclaration.DeclarationText = declarationText;
                                    }
                                }

                                /* Join on condition that VERSION and AUTHOR fields are already provided. */
                                if (bVersionFound | bAuthorFound)
                                {
                                    declarationText = String.Join("\n", arrText);
                                    newItemDeclaration.DeclarationText = declarationText;
                                }
                            }
                        }                          
                    }                   
                }
            }
            catch (Exception)
            {
                errorWhileSetting = true;
                /* If needed, add further exception handling here. */
            }

            /* Save and close solution. */
            string solutionDir = System.IO.Path.GetDirectoryName(dte.Solution.FullName);
            dte.Solution.SaveAs(solutionDir);
            if (dte.ActiveDocument != null) 
                dte.ActiveDocument.Save();

            /* Revoke message filter. */
            MessageFilter.Revoke();

            if (!errorWhileSetting)
                ui.Text = "Successfully set version information!";
            else
                ui.Text = "An error occured while setting version information!";

            ui.clearControls();
        }
       
        private static bool IsPOU(ITcSmTreeItem childNode)
        {
            /* Determines if the tree item is a PRG, FB or FUNC. */
            return childNode.ItemType == (int)TCatSysManagerLib.TREEITEMTYPES.TREEITEMTYPE_PLCPOUFB
                || childNode.ItemType == (int)TCatSysManagerLib.TREEITEMTYPES.TREEITEMTYPE_PLCPOUFUNC
                || childNode.ItemType == (int)TCatSysManagerLib.TREEITEMTYPES.TREEITEMTYPE_PLCPOUPROG;
        }
        
    }
}
