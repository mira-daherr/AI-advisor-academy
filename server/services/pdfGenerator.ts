import puppeteer from 'puppeteer';

export const generateAdvisorPDF = async (data: any) => {
    const { user, studentData, recommendations } = data;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; color: #0F172A; }
        .page { height: 100vh; width: 100vw; position: relative; padding: 60px; box-sizing: border-box; page-break-after: always; }
        .header { height: 80px; background: #0F172A; margin: -60px -60px 40px -60px; padding: 20px 60px; display: flex; align-items: center; border-bottom: 4px solid #EAB308; }
        .header h1 { color: white; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; }
        .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 150px; color: rgba(15, 23, 42, 0.03); font-weight: 900; pointer-events: none; z-index: -1; white-space: nowrap; }
        
        /* Page 1: Cover */
        .cover { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: #F8FAFC; }
        .logo { font-size: 48px; font-weight: 900; color: #0F172A; margin-bottom: 20px; }
        .logo span { color: #EAB308; }
        .cover-title { font-size: 56px; color: #0F172A; font-weight: 900; line-height: 1.1; margin-bottom: 40px; }
        .student-name { font-size: 24px; font-weight: 700; color: #64748B; margin-top: 100px; }
        .identity-statement { margin-top: 60px; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-left: 6px solid #EAB308; text-align: left; max-width: 600px; font-style: italic; font-size: 18px; line-height: 1.6; }

        /* General layout */
        h2 { font-size: 32px; font-weight: 900; color: #0F172A; border-bottom: 2px solid #F1F5F9; padding-bottom: 10px; margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: white; border: 1px solid #F1F5F9; border-radius: 15px; padding: 20px; margin-bottom: 15px; }
        .card h3 { margin: 0 0 10px 0; color: #0F172A; font-size: 18px; }
        .card p { margin: 0; color: #64748B; font-size: 13px; line-height: 1.5; }
        .badge { background: #F1F5F9; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .salary { color: #10B981; font-weight: 900; margin-top: 10px; display: block; }
        
        .footer { position: absolute; bottom: 30px; left: 60px; right: 60px; display: flex; justify-content: space-between; border-top: 1px solid #F1F5F9; padding-top: 10px; font-size: 10px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <!-- Page 1: Cover -->
      <div class="page cover">
        <div class="logo">Academic<span>Advisor</span>.ai</div>
        <div class="cover-title">PERSONALIZED<br/>ACADEMIC REPORT</div>
        <div class="identity-statement">"${recommendations.academicStatement}"</div>
        <div class="student-name">Student: ${user.name}</div>
        <div class="footer"><span>Generated on ${new Date().toLocaleDateString()}</span><span>AcademicAdvisor.ai</span></div>
      </div>

      <!-- Page 2: Profile -->
      <div class="page">
        <div class="header"><h1>Student Profile</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>Your Background</h2>
        <div class="grid">
          <div class="card"><h3>Hobbies & Interests</h3><p>${studentData.hobbies.join(', ')}</p></div>
          <div class="card"><h3>Future Vision</h3><p>${studentData.futureVision}</p></div>
          <div class="card"><h3>Academic Grades</h3><p>Math: ${studentData.grades.math}, Science: ${studentData.grades.science}, Language: ${studentData.grades.language}, Social: ${studentData.grades.socialStudies}</p></div>
          <div class="card"><h3>Independence Level</h3><p>${studentData.independence}</p></div>
          <div class="card"><h3>Preferred Regions</h3><p>${studentData.regions.join(', ')}</p></div>
          <div class="card"><h3>Financial Budget</h3><p>${studentData.budget}</p></div>
        </div>
        <div class="footer"><span>Page 2</span><span>${user.name}</span></div>
      </div>

      <!-- Page 3: Recommended Majors -->
      <div class="page">
        <div class="header"><h1>Pathways</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>Recommended Majors</h2>
        <div>
          ${recommendations.majors.map((m: any) => `
            <div class="card" style="border-left: 4px solid #0F172A">
              <div style="display: flex; justify-content: space-between">
                <h3>${m.name}</h3>
                <span class="badge">94% MATCH</span>
              </div>
              <p>${m.reason}</p>
              <span class="salary">Est. Salary: ${m.salaryRange}</span>
            </div>
          `).join('')}
        </div>
        <div class="footer"><span>Page 3</span><span>${user.name}</span></div>
      </div>

      <!-- Page 4: Recommended Universities -->
      <div class="page">
        <div class="header"><h1>Institutions</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>Best Fit Universities</h2>
        <div class="grid">
          ${recommendations.universities.map((u: any) => `
            <div class="card">
              <h3>${u.name}</h3>
              <p style="font-weight: bold; margin-bottom: 5px;">${u.country} | <span style="color: #64748B">${u.tuition}</span></p>
              <p>${u.reason}</p>
            </div>
          `).join('')}
        </div>
        <div class="footer"><span>Page 4</span><span>${user.name}</span></div>
      </div>

      <!-- Page 5: Scholarships -->
      <div class="page">
        <div class="header"><h1>Financial Aid</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>Eligible Scholarships</h2>
        <div>
          ${recommendations.scholarships.map((s: any) => `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center">
              <div>
                <h3 style="margin-bottom: 5px">${s.name}</h3>
                <p>${s.eligibility}</p>
              </div>
              <div style="text-align: right">
                <span style="font-size: 20px; font-weight: 900; color: #10B981">${s.amount}</span><br/>
                <span style="font-size: 10px; color: #94A3B8">Deadline: June 2026</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="footer"><span>Page 5</span><span>${user.name}</span></div>
      </div>

      <!-- Page 6: Advice & Next Steps -->
      <div class="page">
        <div class="header"><h1>Final Strategy</h1></div>
        <div class="watermark">${user.name.toUpperCase()}</div>
        <h2>Expert Advisor's Advice</h2>
        <div class="card" style="background: #F8FAFC; border: none; padding: 40px; font-style: italic; line-height: 1.8">
          "${recommendations.advice}"
        </div>
        <h2>Your Next 5 Steps</h2>
        <div style="padding-left: 20px">
          <p style="margin-bottom: 15px">1. <b>Research:</b> Deep dive into the top 3 universities listed on page 4.</p>
          <p style="margin-bottom: 15px">2. <b>Application:</b> Draft your personal statement focusing on your ${studentData.hobbies[0]} experience.</p>
          <p style="margin-bottom: 15px">3. <b>Testing:</b> Set a date for your English proficiency or standardized tests.</p>
          <p style="margin-bottom: 15px">4. <b>Scholarships:</b> Begin drafting the essay for the ${recommendations.scholarships[0].name}.</p>
          <p style="margin-bottom: 15px">5. <b>Consistency:</b> Maintain your grades in ${studentData.grades.math > 80 ? 'Mathematics' : 'your core subjects'} to ensure eligibility.</p>
        </div>
        <div style="text-align: center; margin-top: 60px; color: #0F172A; font-weight: 900; font-size: 20px;">
          YOU'VE GOT THIS! 🎓
        </div>
        <div class="footer"><span>Page 6</span><span>${user.name}</span></div>
      </div>
    </body>
    </html>
  `;

    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdf;
};
