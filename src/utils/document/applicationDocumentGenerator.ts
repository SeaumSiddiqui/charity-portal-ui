import { OrphanApplication, Gender, PhysicalCondition } from '../../types';
import { userService } from '../../services/userService';
import QCIcon from '../../assets/QC icon.png';

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('bn-BD');
};

export const getGenderText = (gender?: Gender | string): string => {
  if (gender === Gender.MALE || gender === 'MALE') return 'ছেলে';
  if (gender === Gender.FEMALE || gender === 'FEMALE') return 'মেয়ে';
  return '';
};

export const getPhysicalConditionText = (condition?: PhysicalCondition | string): string => {
  switch (condition) {
    case PhysicalCondition.HEALTHY:
    case 'HEALTHY':
      return 'সুস্থ';
    case PhysicalCondition.SICK:
    case 'SICK':
      return 'অসুস্থ';
    case PhysicalCondition.DISABLED:
    case 'DISABLED':
      return 'প্রতিবন্ধী';
    default:
      return '';
  }
};

export const getResidenceStatusText = (status?: string): string => {
  switch (status) {
    case 'OWN':
      return 'নিজ';
    case 'RENTED':
      return 'ভাড়া';
    case 'SHELTERED':
      return 'আশ্রয়প্রাপ্ত';
    case 'HOMELESS':
      return 'গৃহহীন';
    default:
      return '';
  }
};

export const getHouseTypeText = (houseType?: string): string => {
  switch (houseType) {
    case 'CONCRETE_HOUSE':
      return 'পাকা';
    case 'SEMI_CONCRETE_HOUSE':
      return 'আধা পাকা';
    case 'MUD_HOUSE':
      return 'কাঁচা';
    default:
      return '';
  }
};

export const getMaritalStatusText = (status?: string): string => {
  switch (status) {
    case 'UNMARRIED':
      return 'অবিবাহিত';
    case 'MARRIED':
      return 'বিবাহিত';
    case 'DIVORCED':
      return 'বিবাহবিচ্ছেদ';
    case 'WIDOWED':
      return 'বিধবা/বিপত্নীক';
    default:
      return '';
  }
};

export const generateApplicationDocumentHTML = async (application: OrphanApplication): Promise<string> => {
  console.log('NID value in application:', application.basicInformation?.NID);
  console.log('Basic Information:', application.basicInformation);

  const signatures: Record<string, string | null> = {
    agent: null,
    investigator: null,
    authenticator: null,
    qcSwd: null
  };

  if (application.verification?.agentUserId) {
    try {
      signatures.agent = await userService.getUserSignatureUrl(application.verification.agentUserId);
    } catch (error) {
      console.log('No agent signature found');
    }
  }

  if (application.verification?.investigatorUserId) {
    try {
      signatures.investigator = await userService.getUserSignatureUrl(application.verification.investigatorUserId);
    } catch (error) {
      console.log('No investigator signature found');
    }
  }

  if (application.verification?.authenticatorUserId) {
    try {
      signatures.authenticator = await userService.getUserSignatureUrl(application.verification.authenticatorUserId);
    } catch (error) {
      console.log('No authenticator signature found');
    }
  }

  if (application.verification?.qcSwdUserId) {
    try {
      signatures.qcSwd = await userService.getUserSignatureUrl(application.verification.qcSwdUserId);
    } catch (error) {
      console.log('No QC SWD signature found');
    }
  }

  const numOfSiblings = application.primaryInformation?.numOfSiblings || 0;
  const shouldShowTable = numOfSiblings > 0;

  const familyMembersArray = application.familyMembers || [];

  const allRows: string[] = [];
  for (let i = 0; i < numOfSiblings; i++) {
    const member = familyMembersArray[i];
    allRows.push(`
        <tr>
          <td>${i + 1}</td>
          <td style="text-align: left; padding-left: 8px;">${member?.name || ''}</td>
          <td>${member?.age || ''}</td>
          <td>${getGenderText(member?.siblingsGender)}</td>
          <td>${member?.siblingsGrade || ''}</td>
          <td>${member?.occupation || ''}</td>
          <td>${getMaritalStatusText(member?.maritalStatus)}</td>
        </tr>
      `);
  }

  const familyMembersRows = allRows.join('');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>এতিম নিবন্ধন ফর্ম - ${application.primaryInformation?.fullName}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Kalpurush', 'SolaimanLipi', Arial, sans-serif;
            margin: 0;
            padding: 15px;
            line-height: 1.4;
            color: #000;
            font-size: 11.5pt;
            background: #363636ff;
        }

        .container {
            max-width: 210mm;
            border-radius: 8px;
            margin: 0 auto;
            padding: 15px 15px 40px 15px;
            background: white;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
            padding-bottom: 5px;
            position: relative; /* important */
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 0;
        }

        .logo {
            width: auto;
            height: 70px;
            flex-shrink: 0;
        }

        .logo img {
            width: auto;
            height: 100%;
            object-fit: contain;
        }

        .title-section {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            pointer-events: none; /* prevents blocking clicks if needed */
        }

        .main-title {
            font-size: 20pt;
            font-weight: bold;
            margin: 0;
            padding-top: 8px;
        }

        .photo-box {
            width: 150px;
            height: 60px;
            border: 2px solid #4A90E2;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 11pt;
            flex-shrink: 0;
            border-radius: 8px;
            padding: 5px 10px;
        }

        .info-label {
            font-size: 10pt;
            margin: 8px 0 6px 0;
            font-weight: 500;
        }

        .field-row {
            display: flex;
            gap: 15px;
            margin-bottom: 4px;
            align-items: baseline;
        }

        .field {
            display: flex;
            align-items: baseline;
            flex: 1;
            min-width: 0;
        }

        .field-label {
            white-space: nowrap;
            font-size: 10pt;
            margin-right: 4px;
        }

        .field-value {
            flex: 1;
            position: relative;
            min-height: 18px;
            padding: 0 4px 2px 4px;
            font-size: 10pt;
            background-image: linear-gradient(to right, #000 50%, transparent 50%);
            background-size: 4px 1px;
            background-repeat: repeat-x;
            background-position: bottom;
        }

        .section-title {
            font-weight: 600;
            margin: 10px 0 4px 0;
            font-size: 10pt;
        }

        .address-row {
            display: flex;
            gap: 10px;
            margin-bottom: 4px;
        }

        .address-field {
            display: flex;
            align-items: baseline;
            flex: 1;
        }

        .family-count {
            display: flex;
            align-items: baseline;
            margin: 8px 0;
        }

        .family-count-label {
            font-size: 10pt;
            margin-right: 8px;
        }

        .family-count-value {
            min-width: 80px;
            position: relative;
            padding: 0 4px 2px 4px;
            font-size: 10pt;
            background-image: linear-gradient(to right, #000 50%, transparent 50%);
            background-size: 4px 1px;
            background-repeat: repeat-x;
            background-position: bottom;
        }

        .family-count-extra {
            margin-left: 15px;
            font-size: 10pt;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
            font-size: 10pt;
        }

        th, td {
            border: 1px solid #000;
            padding: 4px 6px;
            text-align: center;
        }

        th {
            background-color: #f5f5f5;
            font-weight: 600;
            font-size: 10pt;
        }

        td {
            height: 22px;
        }

        .col-serial { width: 30px; }
        .col-name { width: auto; }
        .col-age { width: 50px; }
        .col-gender { width: 60px; }
        .col-grade { width: 60px; }
        .col-occupation { width: 100px; }
        .col-marital { width: 120px; }

        .radio-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 6px 0;
            font-size: 10pt;
        }

        .radio-label {
            font-weight: 500;
            margin-right: 4px;
        }

        .radio-item {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            margin-right: 12px;
        }

        .radio-item input[type="radio"] {
            width: 12px;
            height: 12px;
            margin: 0;
        }

        .disease-inline {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 15px;
        }

        .disease-type {
            flex: 1;
            border-bottom: 1px dotted #000;
            padding: 0 4px;
            min-width: 150px;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 6px 0;
            font-size: 10pt;
        }

        .checkbox-label {
            font-weight: 800;
            margin-right: 4px;
        }

        .checkbox-item {
            display: inline-flex;
            align-items: center;
            gap: 3px;
        }

        .checkbox-item input[type="checkbox"] {
            width: 14px;
            height: 14px;
            margin: 0;
            border: 1px solid #000;
        }

        .verification-type {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border: 2px solid #000;
            border-radius: 6px;
            font-size: 10pt;
        }

        .verification-type input[type="radio"] {
            width: 14px;
            height: 14px;
        }

        .doc-table {
            margin-top: 8px;
        }

        .doc-table th {
            font-size: 9pt;
            padding: 6px 4px;
        }

        .doc-table td {
            height: 30px;
        }

        .signature-table {
            margin-top: 12px;
            border: 1px solid #000;
            table-layout: fixed;
        }

        .signature-table th {
            background-color: #FEF3C7;
            font-weight: 600;
            padding: 6px;
            font-size: 10pt;
            width: 25%;
        }

        .signature-cell {
            height: 60px;
            vertical-align: bottom;
            padding: 8px;
            background: white;
            width: 25%;
        }

        .signature-img {
            max-width: 120px;
            max-height: 55px;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }

        .footer-note {
            margin-top: 10px;
            font-size: 9pt;
            line-height: 1.3;
            text-align: justify;
        }

        .footer-contact {
            margin-top: 6px;
            font-size: 8.5pt;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
                background: white !important;
            }

            .container {
                page-break-after: avoid;
                margin: 0;
                padding: 20px 15px 25px 15px;
                box-shadow: none;
            }

            .field-value,
            .family-count-value {
                background-image: none !important;
                border-bottom: 1px dotted #000 !important;
                padding-bottom: 0 !important;
            }

            @page {
                margin: 0;
                size: A4;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                <div class="logo">
                    <img src=${QCIcon}
                    alt="Qatar Charity Logo" 
                    onerror="this.parentElement.innerHTML='<div style=\\'width:60px;height:60px;background:#8B1538;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:18pt\\'>QC</div>'">
                </div>
            </div>
            <div class="title-section">
                <h1 class="main-title">এতিম নিবন্ধন ফর্ম</h1>
            </div>
            <div class="photo-box">
                কোড:
            </div>
        </div>

        <div class="section-title">এতিমের ব্যক্তিগত তথ্য:</div>

        <div class="field-row">
            <div class="field" style="flex: 2;">
                <span class="field-label">পূর্ণ নাম:</span>
                <span class="field-value">${application.primaryInformation?.fullName || ''}</span>
            </div>
            <div class="field" style="flex: 1.5;">
                <span class="field-label">জন্ম নিবন্ধন নং:</span>
                <span class="field-value">${application.primaryInformation?.bcRegistration || ''}</span>
            </div>
            <div class="field" style="flex: 0.8;">
                <span class="field-label">লিঙ্গ:</span>
                <span class="field-value">${getGenderText(application.primaryInformation?.gender)}</span>
            </div>
            <div class="field" style="flex: 0.8;">
                <span class="field-label">ধর্ম:</span>
                <span class="field-value">ইসলাম</span>
            </div>
        </div>

        <div class="field-row">
            <div class="field">
                <span class="field-label">জন্ম তারিখ:</span>
                <span class="field-value">${formatDate(application.primaryInformation?.dateOfBirth)}</span>
            </div>
            <div class="field">
                <span class="field-label">জন্মস্থান:</span>
                <span class="field-value">${application.primaryInformation?.placeOfBirth || ''}</span>
            </div>
            <div class="field" style="flex: 0.8;">
                <span class="field-label">বয়স:</span>
                <span class="field-value">${application.primaryInformation?.age || ''}</span>
            </div>
            <div class="field" style="flex: 0.8;">
                <span class="field-label">জাতীয়তা:</span>
                <span class="field-value">${application.primaryInformation?.nationality || 'বাংলাদেশী'}</span>
            </div>
        </div>

        <div class="field-row">
            <div class="field" style="flex: 2;">
                <span class="field-label">পিতার নাম:</span>
                <span class="field-value">${application.primaryInformation?.fathersName || ''}</span>
            </div>
            <div class="field" style="flex: 1.5;">
                <span class="field-label">মৃত্যুর তারিখ:</span>
                <span class="field-value">${formatDate(application.primaryInformation?.dateOfDeath)}</span>
            </div>
            <div class="field" style="flex: 0.8;">
                <span class="field-label">মৃত্যুর কারণ:</span>
                <span class="field-value">${application.primaryInformation?.causeOfDeath || ''}</span>
            </div>
        </div>

        <div class="field-row">
            <div class="field" style="flex: 2;">
                <span class="field-label">মাতার নাম:</span>
                <span class="field-value">${application.primaryInformation?.mothersName || ''}</span>
            </div>
            <div class="field" style="flex: 1.5;">
                <span class="field-label">মাতার পেশা:</span>
                <span class="field-value">${application.primaryInformation?.mothersOccupation || ''}</span>
            </div>
            <div class="field" style="flex: 0.8;">
                <span class="field-label">মাতার অবস্থা:</span>
                <span class="field-value">${application.primaryInformation?.mothersStatus || ''}</span>
            </div>
        </div>

        <div class="field-row">
            <div class="field" style="flex: 2;">
                <span class="field-label">পারিবারিক বার্ষিক আয়:</span>
                <span class="field-value">${application.primaryInformation?.annualIncome || ''}</span>
            </div>
            <div class="field" style="flex: 1.5;">
                <span class="field-label">স্থায়ী সম্পদ:</span>
                <span class="field-value">${application.primaryInformation?.fixedAssets || ''}</span>
            </div>
            <div class="field" style="flex: 0.8;">
                <span class="field-label">ভাইবোনের সংখ্যা:</span>
                <span class="field-value">${application.primaryInformation?.numOfSiblings || ''}</span>
            </div>
        </div>

        <div class="field-row">
            <div class="field" style="flex: 2;">
                <span class="field-label">অধ্যয়নরত প্রতিষ্ঠানের নাম:</span>
                <span class="field-value">${application.primaryInformation?.academicInstitution || ''}</span>
            </div>
            <div class="field" style="flex: 0.8;">
                <span class="field-label">শ্রেণী:</span>
                <span class="field-value">${application.primaryInformation?.grade || ''}</span>
            </div>
        </div>

        <div class="section-title">বর্তমান ঠিকানা:</div>
        <div class="address-row">
            <div class="address-field">
                <span class="field-label">জেলা:</span>
                <span class="field-value">${application.address?.presentDistrict || ''}</span>
            </div>
            <div class="address-field">
                <span class="field-label">উপজেলা:</span>
                <span class="field-value">${application.address?.presentSubDistrict || ''}</span>
            </div>
            <div class="address-field">
                <span class="field-label">ইউনিয়ন:</span>
                <span class="field-value">${application.address?.presentUnion || ''}</span>
            </div>
            <div class="address-field">
                <span class="field-label">গ্রাম:</span>
                <span class="field-value">${application.address?.presentVillage || ''}</span>
            </div>
        </div>

        <div class="section-title">স্থায়ী ঠিকানা:</div>
        <div class="address-row">
            <div class="address-field">
                <span class="field-label">জেলা:</span>
                <span class="field-value">${application.address?.permanentDistrict || ''}</span>
            </div>
            <div class="address-field">
                <span class="field-label">উপজেলা:</span>
                <span class="field-value">${application.address?.permanentSubDistrict || ''}</span>
            </div>
            <div class="address-field">
                <span class="field-label">ইউনিয়ন:</span>
                <span class="field-value">${application.address?.permanentUnion || ''}</span>
            </div>
            <div class="address-field">
                <span class="field-label">গ্রাম:</span>
                <span class="field-value">${application.address?.permanentVillage || ''}</span>
            </div>
        </div>

        ${shouldShowTable ? `
        <table>
            <thead>
                <tr>
                    <th class="col-serial">ক্র</th>
                    <th class="col-name">নাম</th>
                    <th class="col-age">বয়স</th>
                    <th class="col-gender">লিঙ্গ</th>
                    <th class="col-grade">শ্রেণী</th>
                    <th class="col-occupation">পেশা</th>
                    <th class="col-marital">বৈবাহিক অবস্থা</th>
                </tr>
            </thead>
            <tbody>
                ${familyMembersRows}
            </tbody>
        </table>
        ` : ''}

        <div class="field-row">
            <div class="field">
                <span class="field-label">শারিরীক অবস্থা:</span>
                <span class="field-value">${application.basicInformation?.physicalCondition || ''}</span>
            </div>
            <div class="field">
                <span class="field-label">গুরুতর রোগ:</span>
                <span class="field-value">${application.basicInformation?.hasCriticalIllness || ''}</span>
            </div>
            <div class="field">
                <span class="field-label">রোগের ধরণ:</span>
                <span class="disease-type">${application.basicInformation?.typeOfIllness || ''}</span>
            </div>
        </div>

        <div class="checkbox-group">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span>বাসস্থান:</span>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <span>${getResidenceStatusText(application.basicInformation?.residenceStatus) === 'নিজ' ? '◉' : '○'}</span>
                    <span>নিজ বাড়ি</span>

                    <span>${getResidenceStatusText(application.basicInformation?.residenceStatus) === 'ভাড়া' ? '◉' : '○'}</span>
                    <span>ভাড়া বাড়ি</span>

                    <span>${getResidenceStatusText(application.basicInformation?.residenceStatus) === 'আশ্রয়প্রাপ্ত' ? '◉' : '○'}</span>
                    <span>আশ্রিত বাড়ি</span>

                    <span>${getResidenceStatusText(application.basicInformation?.residenceStatus) === 'গৃহহীন' ? '◉' : '○'}</span>
                    <span>গৃহহীন</span>
                </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
                <span>বাড়ির ধরন:</span>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <span>${application.basicInformation?.houseType === 'CONCRETE_HOUSE' ? '◉' : '○'}</span>
                    <span>পাকা</span>

                    <span>${application.basicInformation?.houseType === 'SEMI_CONCRETE_HOUSE' ? '◉' : '○'}</span>
                    <span>আধা পাকা</span>

                    <span>${application.basicInformation?.houseType === 'MUD_HOUSE' ? '◉' : '○'}</span>
                    <span>কাঁচা</span>
                </div>
            </div>

            <div style="
                border: 2px solid #4A90E2;
                border-radius: 8px;
                padding: 6px 36px;
                width: fit-content;
                display: flex;
                flex-direction: column;
                gap: 3px;
                font-size: 16px;
                margin-left: auto;
            ">
                <div style="display: flex; align-items: center; gap: 5px;">
                    ${application.basicInformation?.isResident ? '◉' : '○'}
                    <span>আবাসিক</span>
                </div>

                <div style="display: flex; align-items: center; gap: 5px;">
                    ${application.basicInformation?.isResident ? '○' : '◉'}
                    <span>অনাবাসিক</span>
                </div>
            </div>
        </div>

        <div class="section-title" style="margin-top: 10px;">কক্ষের বর্ণনা:</div>
        <table class="doc-table">
            <thead>
                <tr>
                    <th>শয়নকক্ষ</th>
                    <th>বারান্দা</th>
                    <th>রান্নাঘর</th>
                    <th>স্টোররুম</th>
                    <th>টিউবওয়েল</th>
                    <th>টয়লেট</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${application.basicInformation?.bedroom || ''}</td>

                    <td>${application.basicInformation?.balcony ? 'হ্যাঁ' : 'না'}</td>

                    <td>${application.basicInformation?.kitchen ? 'হ্যাঁ' : 'না'}</td>

                    <td>${application.basicInformation?.store ? 'হ্যাঁ' : 'না'}</td>

                    <td>${application.basicInformation?.hasTubeWell ? 'হ্যাঁ' : 'না'}</td>

                    <td>${application.basicInformation?.toilet ? 'হ্যাঁ' : 'না'}</td>
                </tr>
            </tbody>
        </table>

        <table class="doc-table">
            <thead>
                <tr>
                    <th>অভিভাবকের নাম</th>
                    <th>সম্পর্ক</th>
                    <th>NID নম্বর</th>
                    <th>মোবাইল নম্বর</th>
                    <th>মোবাইল নম্বর</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${application.basicInformation?.guardiansName || ''}</td>
                    <td>${application.basicInformation?.guardiansRelation || ''}</td>
                    <td>${application.basicInformation?.NID || (application.basicInformation as any)?.nid || ''}</td>
                    <td>${application.basicInformation?.cell1 || ''}</td>
                    <td>${application.basicInformation?.cell2 || ''}</td>
                </tr>
            </tbody>
        </table>

        <table class="signature-table">
            <thead>
                <tr>
                    <th>শিক্ষাগত</th>
                    <th>পরিদর্শনকারী</th>
                    <th>অনুমোদনকারী</th>
                    <th>QC SWD</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="signature-cell">
                        ${signatures.agent ? `<img src="${signatures.agent}" alt="Agent Signature" class="signature-img" />` : ''}
                    </td>
                    <td class="signature-cell">
                        ${signatures.investigator ? `<img src="${signatures.investigator}" alt="Investigator Signature" class="signature-img" />` : ''}
                    </td>
                    <td class="signature-cell">
                        ${signatures.authenticator ? `<img src="${signatures.authenticator}" alt="Authenticator Signature" class="signature-img" />` : ''}
                    </td>
                    <td class="signature-cell">
                        ${signatures.qcSwd ? `<img src="${signatures.qcSwd}" alt="QC SWD Signature" class="signature-img" />` : ''}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="footer-note">
        </div>

        <div class="footer-contact">
            <span>QCBD-SWD-EZ-Mobile-01327-076658 Email: qcbdswdez@gmail.com</span>
            <span>Ref: ...........................</span>
        </div>
    </div>
</body>
</html>`;
};
