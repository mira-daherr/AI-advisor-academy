import puppeteer from 'puppeteer';

export const generateAdvisorPDF = async (data: any) => {
  const { user, studentData, recommendations } = data;
  const lang = recommendations.language || 'ar';
  const isRTL = lang === 'ar';

  const html = `
    <!DOCTYPE html>
    <html dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
      <style>
        body { font-family: ${isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif"}; margin: 0; padding: 0; color: #0F172A; }
        .page { height: 100vh; width: 100vw; position: relative; padding: 60px; box-sizing: border-box; page-break-after: always; }
        .header { height: 80px; background: #0F172A; margin: -60px -60px 40px -60px; padding: 20px 60px; display: flex; align-items: center; border-bottom: 4px solid #EAB308; }
        .header h1 { color: white; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; }
        .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 150px; color: rgba(15, 23, 42, 0.03); font-weight: 900; pointer-events: none; z-index: -1; white-space: nowrap; }
        
        .cover { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: #F8FAFC; }
        .logo { font-size: 48px; font-weight: 900; color: #0F172A; margin-bottom: 20px; }
        .logo span { color: #EAB308; }
        .cover-title { font-size: 56px; color: #0F172A; font-weight: 900; line-height: 1.1; margin-bottom: 40px; }
        .student-name { font-size: 24px; font-weight: 700; color: #64748B; margin-top: 100px; }
        .identity-statement { margin-top: 60px; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-${isRTL ? 'right' : 'left'}: 6px solid #EAB308; text-align: ${isRTL ? 'right' : 'left'}; max-width: 600px; font-style: italic; font-size: 18px; line-height: 1.6; }

        h2 { font-size: 32px; font-weight: 900; color: #0F172A; border-bottom: 2px solid #F1F5F9; padding-bottom: 10px; margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: white; border: 1px solid #F1F5F9; border-radius: 15px; padding: 20px; margin-bottom: 15px; text-align: ${isRTL ? 'right' : 'left'}; }
        .card h3 { margin: 0 0 10px 0; color: #0F172A; font-size: 18px; }
        .card p { margin: 0; color: #64748B; font-size: 13px; line-height: 1.5; }
        .badge { background: #F1F5F9; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .salary { color: #10B981; font-weight: 900; margin-top: 10px; display: block; }
        
        .footer { position: absolute; bottom: 30px; left: 60px; right: 60px; display: flex; justify-content: space-between; flex-direction: ${isRTL ? 'row-reverse' : 'row'}; border-top: 1px solid #F1F5F9; padding-top: 10px; font-size: 10px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="page cover">
        <div class="logo">Academic<span>Advisor</span>.ai</div>
        <div class="cover-title">${isRTL ? 'تقرير أكاديمي مخصص' : 'PERSONALIZED<br/>ACADEMIC REPORT'}</div>
        <div class="identity-statement">"${recommendations.academicStatement}"</div>
        <div class="student-name">${isRTL ? 'الطالب' : 'Student'}: ${user.name}</div>
        <div class="footer"><span>${isRTL ? 'تم الإنشاء في' : 'Generated on'} ${new Date().toLocaleDateString()}</span><span>AcademicAdvisor.ai</span></div>
      </div>

      <div class="page">
        <div class="header"><h1>${isRTL ? 'ملف الطالب' : 'Student Profile'}</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>${isRTL ? 'خلفيتك الأكاديمية' : 'Your Background'}</h2>
        <div class="grid">
          <div class="card"><h3>${isRTL ? 'الهوايات والاهتمامات' : 'Hobbies & Interests'}</h3><p>${(studentData.hobbies || []).join(', ')}</p></div>
          <div class="card"><h3>${isRTL ? 'الرؤية المستقبلية' : 'Future Vision'}</h3><p>${studentData.futureVision || 'N/A'}</p></div>
          <div class="card"><h3>${isRTL ? 'الدرجات الأكاديمية' : 'Academic Grades'}</h3><p>${isRTL ? 'الرياضيات' : 'Math'}: ${studentData.grades?.math || 'N/A'}, ${isRTL ? 'العلوم' : 'Science'}: ${studentData.grades?.science || 'N/A'}, ${isRTL ? 'اللغة' : 'Language'}: ${studentData.grades?.language || 'N/A'}</p></div>
          <div class="card"><h3>${isRTL ? 'مستوى الاستقلالية' : 'Independence Level'}</h3><p>${studentData.independence || 'N/A'}</p></div>
          <div class="card"><h3>${isRTL ? 'المناطق المفضلة' : 'Preferred Regions'}</h3><p>${(studentData.regions || []).join(', ')}</p></div>
          <div class="card"><h3>${isRTL ? 'الميزانية المالية' : 'Financial Budget'}</h3><p>${studentData.budget}</p></div>
        </div>
        <div class="footer"><span>${isRTL ? 'صفحة ٢' : 'Page 2'}</span><span>${user.name}</span></div>
      </div>

      <div class="page">
        <div class="header"><h1>${isRTL ? 'المسارات الأكاديمية' : 'Pathways'}</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>${isRTL ? 'التخصصات الموصى بها' : 'Recommended Majors'}</h2>
        <div>
          ${(recommendations.recommendations || []).map((m: any) => `
            <div class="card" style="border-${isRTL ? 'right' : 'left'}: 4px solid #0F172A">
              <div style="display: flex; justify-content: space-between; flex-direction: ${isRTL ? 'row-reverse' : 'row'}">
                <h3>${m.major}</h3>
                <span class="badge">${isRTL ? 'طابق بنسبة ٩٤٪' : '94% MATCH'}</span>
              </div>
              <p>${m.why}</p>
              <span class="salary">${isRTL ? 'الراتب المتوقع' : 'Est. Salary'}: ${m.salary}</span>
            </div>
          `).join('')}
        </div>
        <div class="footer"><span>${isRTL ? 'صفحة ٣' : 'Page 3'}</span><span>${user.name}</span></div>
      </div>

      <div class="page">
        <div class="header"><h1>${isRTL ? 'المؤسسات التعليمية' : 'Institutions'}</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>${isRTL ? 'أفضل الجامعات المناسبة' : 'Best Fit Universities'}</h2>
        <div class="grid">
          ${(recommendations.universities || []).map((u: any) => `
            <div class="card">
              <h3>${u.name}</h3>
              <p style="font-weight: bold; margin-bottom: 5px;">${u.country} | <span style="color: #64748B">${u.tuition}</span></p>
              <p>${u.reason}</p>
            </div>
          `).join('')}
        </div>
        <div class="footer"><span>${isRTL ? 'صفحة ٤' : 'Page 4'}</span><span>${user.name}</span></div>
      </div>

      <div class="page">
        <div class="header"><h1>${isRTL ? 'الدعم المالي' : 'Financial Aid'}</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>${isRTL ? 'المنح الدراسية المتاحة' : 'Eligible Scholarships'}</h2>
        <div>
          ${(recommendations.scholarships || []).map((s: any) => `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-direction: ${isRTL ? 'row-reverse' : 'row'}">
              <div>
                <h3 style="margin-bottom: 5px">${s.name}</h3>
                <p>${s.eligibility}</p>
              </div>
              <div style="text-align: ${isRTL ? 'left' : 'right'}">
                <span style="font-size: 20px; font-weight: 900; color: #10B981">${s.amount}</span><br/>
                <span style="font-size: 10px; color: #94A3B8">${isRTL ? 'الموعد النهائي: يونيو ٢٠٢٦' : 'Deadline: June 2026'}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="footer"><span>${isRTL ? 'صفحة ٥' : 'Page 5'}</span><span>${user.name}</span></div>
      </div>

      <div class="page">
        <div class="header"><h1>${isRTL ? 'الاستراتيجية النهائية' : 'Final Strategy'}</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>${isRTL ? 'نصيحة المستشار الخبير' : "Expert Advisor's Advice"}</h2>
        <div class="card" style="background: #F8FAFC; border: none; padding: 40px; font-style: italic; line-height: 1.8">
          "${recommendations.advice}"
        </div>
        <h2>${isRTL ? 'خطواتك الخمس القادمة' : 'Your Next 5 Steps'}</h2>
        <div style="padding-${isRTL ? 'right' : 'left'}: 20px">
          <p style="margin-bottom: 15px">1. <b>${isRTL ? 'البحث' : 'Research'}:</b> ${isRTL ? 'تعمق في أفضل ٣ جامعات مدرجة في صفحة ٤.' : 'Deep dive into the top 3 universities listed on page 4.'}</p>
          <p style="margin-bottom: 15px">2. <b>${isRTL ? 'التقديم' : 'Application'}:</b> ${isRTL ? 'قم بصياغة خطاب الغرض من الدراسة مع التركيز على اهتمامك بـ ' : 'Draft your personal statement focusing on your '}${(studentData.hobbies || [])[0] || (isRTL ? 'اهتماماتك' : 'interests')}.</p>
          <p style="margin-bottom: 15px">3. <b>${isRTL ? 'الاختبارات' : 'Testing'}:</b> ${isRTL ? 'حدد موعداً لاختبارات إتقان اللغة الإنجليزية أو الاختبارات المعيارية.' : 'Set a date for your English proficiency or standardized tests.'}</p>
          <p style="margin-bottom: 15px">4. <b>${isRTL ? 'المنح الدراسية' : 'Scholarships'}:</b> ${isRTL ? 'ابدأ في صياغة مقال التقديم لـ ' : 'Begin drafting the essay for the '}${(recommendations.scholarships || [])[0]?.name || (isRTL ? 'المنح ذات الصلة' : 'relevant scholarships')}.</p>
          <p style="margin-bottom: 15px">5. <b>${isRTL ? 'الاستمرارية' : 'Consistency'}:</b> ${isRTL ? 'حافظ على درجاتك في المواد الأساسية لضمان الأهلية.' : 'Maintain your grades in core subjects to ensure eligibility.'}</p>
        </div>
        <div style="text-align: center; margin-top: 60px; color: #0F172A; font-weight: 900; font-size: 20px;">
          ${isRTL ? 'أنت تستطيع فعلها! 🎓' : "YOU'VE GOT THIS! 🎓"}
        </div>
        <div class="footer"><span>${isRTL ? 'صفحة ٦' : 'Page 6'}</span><span>${user.name}</span></div>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdf;
};
