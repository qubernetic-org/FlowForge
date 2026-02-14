using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

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
    public partial class VersionInfo : Form
    {
        /// <summary>Click event handling.</summary>
        public event ClickHandler WriteConfirm;
        /// <summary>Event arg</summary>
        public EventArgs e = null;
        /// <summary>Delegate for listening/subscribing</summary>
        public delegate void ClickHandler(VersionInfo ut, EventArgs e);

        private string _InfoVersion;
        private string _InfoAuthor;

        /// <summary>Constructor.</summary>
        public VersionInfo()
        {
            InitializeComponent();
        }

        /// <summary>Version number of POUs.</summary>
        public string InfoVersion
        {
            get { return _InfoVersion; }
            set { _InfoVersion = value; }
        }
        /// <summary>Author of POUs.</summary>
        public string InfoAuthor
        {
            get { return _InfoAuthor; }
            set { _InfoAuthor = value; }
        }

        /// <summary>
        /// Clears the controls.
        /// </summary>
        public void clearControls()
        {
            textBoxVersion.Clear();
            textBoxAuthor.Clear();
        }

        private void ButtonOk_Click_1(object sender, EventArgs e)
        {
            _InfoVersion = textBoxVersion.Text;
            _InfoAuthor = textBoxAuthor.Text;
            // Fire click event: user has entered some text
            WriteConfirm(this, e);
        }

        private void button2_Click_1(object sender, EventArgs e)
        {
            // Close the form
            this.Close();
        }
    }
}
