import { MedicalApplication, Gender, MaritalStatus, HouseType, ResidenceStatus, PatientRelation } from '../../types';
import QCLogo from '../../assets/QC BANGLADESH-2.png';
import HeartFrame from '../../assets/heart-frame.png';
import HeartBG from '../../assets/Heart-BG-Final.png';

const imageToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return '';
  }
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getGenderText = (gender?: Gender | string): string => {
  if (gender === Gender.MALE || gender === 'MALE') return 'Male';
  if (gender === Gender.FEMALE || gender === 'FEMALE') return 'Female';
  return '';
};

export const getMaritalStatusText = (status?: MaritalStatus | string): string => {
  switch (status) {
    case MaritalStatus.UNMARRIED:
    case 'UNMARRIED':
      return 'Unmarried';
    case MaritalStatus.MARRIED:
    case 'MARRIED':
      return 'Married';
    case MaritalStatus.DIVORCED:
    case 'DIVORCED':
      return 'Divorced';
    case MaritalStatus.WIDOWED:
    case 'WIDOWED':
    case 'WIDOW':
      return 'Widow';
    default:
      return status || '';
  }
};

export const getHouseStatusText = (status?: ResidenceStatus | string): string => {
  switch (status) {
    case ResidenceStatus.OWN:
    case 'OWN':
      return 'own';
    case ResidenceStatus.RENTED:
    case 'RENTED':
      return 'rent';
    case ResidenceStatus.SHELTERED:
    case 'SHELTERED':
      return 'Sheltered';
    case ResidenceStatus.HOMELESS:
    case 'HOMELESS':
      return 'Homeless';
    default:
      return status || '';
  }
};

export const getHouseTypeText = (type?: HouseType | string): string => {
  switch (type) {
    case HouseType.CONCRETE_HOUSE:
    case 'CONCRETE_HOUSE':
      return 'Building';
    case HouseType.SEMI_CONCRETE_HOUSE:
    case 'SEMI_CONCRETE_HOUSE':
      return 'Half Building';
    case HouseType.MUD_HOUSE:
    case 'MUD_HOUSE':
      return 'Tin Shade';
    default:
      return type || '';
  }
};

export const getRelationText = (relation: PatientRelation | string): string => {
  switch (relation) {
    case 'SELF':
      return 'Self';
    case 'FATHER':
      return 'Father';
    case 'MOTHER':
      return 'Mother';
    case 'BROTHER':
      return 'Brother';
    case 'SISTER':
      return 'Sister';
    case 'OTHERS':
      return 'Others';
    default:
      return relation;
  }
};

export const generateMedicalApplicationDocumentHTML = async (
  application: MedicalApplication,
  passportImageUrl?: string
): Promise<string> => {
  const patient = application.patientInformation;
  const household = application.householdInformation;
  const address = application.patientAddress;
  const contact = application.contactInformation;
  const familyMembers = application.patientFamilyMembers || [];

  // Convert images to base64
  const qcLogoBase64 = await imageToBase64(QCLogo);
  const heartFrameBase64 = await imageToBase64(HeartFrame);
  const heartBgBase64 = await imageToBase64(HeartBG);
  const passportImageBase64 = passportImageUrl ? await imageToBase64(passportImageUrl) : '';

  const familyMembersRows = familyMembers.map((member, index) => `
    <tr>
      <td class="serial">${index + 1}</td>
      <td><span>${member?.name || ''}</span></td>
      <td><span>${member?.age || ''}</span></td>
      <td><span>${getMaritalStatusText(member?.maritalStatus)}</span></td>
      <td><span>${member?.grade || ''}</span></td>
      <td><span>${member?.occupation || ''}</span></td>
    </tr>
  `).join('');

  const contactEntries = contact?.relativeContacts
    ? Object.entries(contact.relativeContacts).filter(([_, phone]) => phone)
    : [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Heart Operation - 2026</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #393939;
            background-color: #fff;
            margin: 0;
            padding: 0;
        }

        .form-container {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            padding: 10mm 10mm;
            background: white;
            background-image: url('${heartBgBase64}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0;
            position: relative;
            flex-shrink: 0;
        }

        .logo-container {
            width: 145px;
            height: 165px;
        }

        .logo-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .title-container {
            flex-grow: 1;
            text-align: center;
            padding: 0 10px;
        }

        .title-container h1 {
            margin: 0;
            color: #aa1054;
            font-size: 24px;
            font-weight: bold;
            white-space: nowrap;
        }

        .title-container h2 {
            margin: 6px 0;
            color: #494949;
            font-size: 17px;
            font-weight: 600;
        }

        .title-row {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 12px;
            text-align: center;
        }

        .title-row .form-group {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
        }

        .title-row label {
            font-weight: 600;
            font-size: 14px;
        }

        .title-row .value {
            font-size: 14px;
            border-bottom: 1px solid #ddd;
            padding: 3px 0;
            min-width: 120px;
        }

        .heart-photo-box {
            width: 170px;
            height: 170px;
            position: relative;
            background-color: transparent;
            flex-shrink: 0;
        }

        .heart-frame {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('${heartFrameBase64}') no-repeat center center;
            background-size: contain;
            z-index: 2;
            pointer-events: none;
        }

        .photo-placeholder {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #4c2424;
            font-size: 11px;
            font-weight: bold;
            z-index: 3;
        }

        .passport-photo {
            position: absolute;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 88%;
            height: 83%;
            object-fit: cover;
            object-position: center 20%;
            z-index: 1;
        }

        .form-row {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 8px;
            width: 100%;
        }

        form {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        }

        .form-group {
            flex: 1;
            min-width: calc(50% - 8px);
            display: flex;
            align-items: center;
        }

        .form-group.full-width {
            flex: 0 0 100%;
            min-width: 100%;
        }

        .form-label {
            font-weight: 600;
            font-size: 14px;
            margin-right: 10px;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .form-value {
            font-size: 14px;
            border-bottom: 1px solid #ddd;
            padding: 3px 0;
            flex-grow: 1;
        }

        .patient-name-container {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
        }

        .dob-container {
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 30%;
        }

        .family-table {
            width: 100%;
            border-collapse: collapse;
            margin: 4px 0;
        }

        .family-table th,
        .family-table td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            text-align: center;
        }

        .family-table th {
            background-color: #aa1054;
            color: #f7f7f7;
            font-weight: bold;
            font-size: 13px;
        }

        .family-table td {
            font-size: 13px;
        }

        .family-table .serial {
            width: 40px;
        }

        .radio-options {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .radio-mark {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid #aa1054;
            border-radius: 50%;
            margin-right: 5px;
            position: relative;
            vertical-align: middle;
        }

        .radio-mark.checked::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: #aa1054;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .checkbox-mark {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid #aa1054;
            margin-right: 5px;
            position: relative;
            vertical-align: middle;
        }

        .checkbox-mark.checked {
            background-color: #aa1054;
        }

        .checkbox-mark.checked::before {
            content: "✓";
            position: absolute;
            color: white;
            font-size: 14px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .checkbox-group {
            display: flex;
            gap: 40px;
            align-items: center;
        }

        /* ── Address table ── */
        .address-table {
            width: 100%;
            border-collapse: collapse;
            margin: 4px 0;
            table-layout: fixed;
        }

        .address-table th,
        .address-table td {
            border: 1px solid #ddd;
            padding: 6px 8px;
        }

        .address-table th {
            background-color: #aa1054;
            color: #f7f7f7;
            font-weight: bold;
            font-size: 13px;
            width: 25%;
        }

        /* Each data cell takes equal remaining width */
        .address-table td {
            width: 37.5%;
        }

        .address-table td label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 13px;
        }

        .address-table td .value {
            flex: 1;
            font-size: 13px;
        }

        .contact-table {
            width: 100%;
            border-collapse: collapse;
            margin: 4px 0;
        }

        .contact-table th,
        .contact-table td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            text-align: center;
        }

        .contact-table th {
            background-color: #aa1054;
            color: #f7f7f7;
            font-weight: bold;
            font-size: 13px;
        }

        .contact-table td {
            font-size: 13px;
        }

        /* ── FIX 1: Comments takes full width ── */
        .comments-section {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            width: 100%;
        }

        .comments-section .form-label {
            padding-top: 8px;
            flex-shrink: 0;
        }

        .comments-box {
            flex: 1;
            width: 0; /* forces flex child to respect flex: 1 and not overflow */
            min-height: 60px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            background: transparent;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
                background: white;
            }

            .form-container {
                padding: 10mm 10mm;
                box-shadow: none;
            }

            @page {
                margin: 0;
                size: A4;
            }
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="header">
            <div class="logo-container">
                <img src="${qcLogoBase64}" alt="Qatar Charity Bangladesh">
            </div>

            <div class="title-container">
                <h1>Heart Operation - 2026</h1>
                <h2>Social History of the Patient</h2>

                <div class="title-row">
                    <div class="form-group">
                        <label>Case ID:</label>
                        <span class="value">${patient?.code || 'QCHO-2026-'}</span>
                    </div>
                </div>
            </div>

            <div class="heart-photo-box">
                <div class="heart-frame"></div>
                ${passportImageBase64
                  ? `<img src="${passportImageBase64}" alt="Patient Photo" class="passport-photo">`
                  : '<div class="photo-placeholder">upload image</div>'
                }
            </div>
        </div>

        <form>
            <div class="form-row">
                <div class="form-group full-width">
                    <label class="form-label">1. Patients Name:</label>
                    <div class="patient-name-container">
                        <span class="form-value" style="flex: 1;">${patient?.fullName || ''}</span>
                        <div class="dob-container">
                            <span>DOB:</span>
                            <span class="form-value">${formatDate(patient?.dateOfBirth) || ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">2. Fathers Name:</label>
                    <span class="form-value">${patient?.fathersName || ''}</span>
                </div>

                <div class="form-group">
                    <label class="form-label">3. Fathers Profession:</label>
                    <span class="form-value">${patient?.fathesProfession || ''}</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">4. Mothers Name:</label>
                    <span class="form-value">${patient?.mothersName || ''}</span>
                </div>

                <div class="form-group">
                    <label class="form-label">5. Mothers Profession:</label>
                    <span class="form-value">${patient?.mothersProfession || ''}</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">6. Monthly Family Income:</label>
                    <span class="form-value">${patient?.annualIncome || ''}</span>
                </div>

                <div class="form-group">
                    <label class="form-label">7. Family Members:</label>
                    <span class="form-value">${patient?.familyMemberCount || ''}</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group full-width">
                    <table class="family-table">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>M Status</th>
                                <th>Class</th>
                                <th>Profession</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${familyMembersRows || '<tr><td colspan="6">No family members</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">8. House Status:</label>
                    <div class="radio-options">
                        <div>
                            <span class="radio-mark ${household?.houseStatus === ResidenceStatus.OWN ? 'checked' : ''}"></span>
                            <label>own</label>
                        </div>
                        <div>
                            <span class="radio-mark ${household?.houseStatus === ResidenceStatus.RENTED ? 'checked' : ''}"></span>
                            <label>rent</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">9. Type:</label>
                    <span class="form-value">${getHouseTypeText(household?.houseType) || ''}</span>
                </div>

                <div class="form-group">
                    <label class="form-label">10. Room:</label>
                    <span class="form-value">${household?.numOfRooms || ''}</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">11. House Size:</label>
                    <span class="form-value">${household?.houseSize || ''}</span>
                </div>

                <div class="form-group">
                    <div class="checkbox-group">
                        <div>
                            <span class="checkbox-mark ${household?.hasTubeWell ? 'checked' : ''}"></span>
                            <label>Tube Well</label>
                        </div>
                        <div>
                            <span class="checkbox-mark ${household?.hasLatrine ? 'checked' : ''}"></span>
                            <label>Latrine</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">12. Plot Size:</label>
                    <span class="form-value">${household?.plotSize ? household.plotSize + ' DCML' : ''}</span>
                </div>

                <div class="form-group">
                    <label class="form-label">13. Land Size:</label>
                    <span class="form-value">${household?.landSize ? household.landSize + ' DCML' : ''}</span>
                </div>
            </div>

            <!-- FIX 2: Address tables use proper <td> cells, no flex on table rows -->
            <div class="form-row">
                <div class="form-group full-width">
                    <table class="address-table">
                        <tbody>
                            <tr>
                                <th>Permanent Address:</th>
                                <td>
                                    <label>District:<span class="value">${address?.permanentDistrict || ''}</span></label>
                                </td>
                                <td>
                                    <label>Upozila:<span class="value">${address?.permanentSubDistrict || ''}</span></label>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding: 0;">
                                    <div style="display:flex;">
                                        <div style="flex:1; padding: 6px 8px; border-right: 1px solid #ddd;">
                                            <label style="display:flex; align-items:center; gap:8px; font-weight:600; font-size:13px;">Union:<span class="value">${address?.permanentUnion || ''}</span></label>
                                        </div>
                                        <div style="flex:1; padding: 6px 8px;">
                                            <label style="display:flex; align-items:center; gap:8px; font-weight:600; font-size:13px;">Village:<span class="value">${address?.permanentVillage || ''}</span></label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group full-width">
                    <table class="address-table">
                        <tbody>
                            <tr>
                                <th>Present Address:</th>
                                <td>
                                    <label>District:<span class="value">${address?.presentDistrict || ''}</span></label>
                                </td>
                                <td>
                                    <label>Upozila:<span class="value">${address?.presentSubDistrict || ''}</span></label>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding: 0;">
                                    <div style="display:flex;">
                                        <div style="flex:1; padding: 6px 8px; border-right: 1px solid #ddd;">
                                            <label style="display:flex; align-items:center; gap:8px; font-weight:600; font-size:13px;">Union:<span class="value">${address?.presentUnion || ''}</span></label>
                                        </div>
                                        <div style="flex:1; padding: 6px 8px;">
                                            <label style="display:flex; align-items:center; gap:8px; font-weight:600; font-size:13px;">Village:<span class="value">${address?.presentVillage || ''}</span></label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group full-width">
                    <table class="contact-table">
                        <tbody>
                            <tr>
                                <th>Relation:</th>
                                ${contactEntries.slice(0, 3).map(([rel]) => `<td>${getRelationText(rel as PatientRelation)}</td>`).join('')}
                                ${contactEntries.length < 3 ? '<td></td>'.repeat(3 - contactEntries.length) : ''}
                            </tr>
                            <tr>
                                <th>Contact Number:</th>
                                ${contactEntries.slice(0, 3).map(([_, phone]) => `<td>${phone}</td>`).join('')}
                                ${contactEntries.length < 3 ? '<td></td>'.repeat(3 - contactEntries.length) : ''}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group full-width">
                    <label class="form-label">12. Email Address:</label>
                    <span class="form-value">${contact?.email || ''}</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group full-width">
                    <div class="comments-section">
                        <label class="form-label">13. Comments:</label>
                        <div class="comments-box">${contact?.additionalComment || ''}</div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</body>
</html>`;
};