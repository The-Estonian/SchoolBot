import capitalizeFirstLetter from '../Helpers/capitalize.js';

const parseProjectInfo = (data, projectName) => {
  let datastream = data.children['div-01'].children[projectName];

  let projLabel = capitalizeFirstLetter(datastream.name);
  let groupMax = datastream.attrs.groupMax;
  let groupMin = datastream.attrs.groupMin;
  let auditRatio = datastream.attrs.requiredAuditRatio;
  let expGained = datastream.attrs.baseXp / 1000 + 'kb';
  let prevProj = capitalizeFirstLetter(
    datastream.attrs.requirements.objects[0].split('/')[1]
  );
  let auditReq = `${datastream.attrs.validations[0].required} out of ${
    datastream.attrs.validations[0].required *
    datastream.attrs.validations[0].ratio
  }`;
  let projLanguage = datastream.attrs.language;
  let spacer = Math.max(
    projLabel.length,
    groupMax.toString().length,
    groupMin.toString().length,
    auditRatio.toString().length,
    expGained.length,
    prevProj.length,
    auditReq.length,
    projLanguage.length
  );
  if (spacer < 15) spacer = 15;
  let strecher = 0;
  if (spacer > 15) strecher = spacer - 15;

  let parseResponse = `\`\`\`
┌────────────────────────────┬────────────────${'─'.repeat(strecher)}┐
│ Project name:              │ ${projLabel}${' '.repeat(
    spacer - projLabel.length
  )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Max members:               │ ${groupMax}${' '.repeat(
    spacer - groupMax.toString().length
  )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Min members:               │ ${groupMin}${' '.repeat(
    spacer - groupMin.toString().length
  )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Min audit ratio:           │ ${auditRatio}${' '.repeat(
    spacer - auditRatio.toString().length
  )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Experience:                │ ${expGained}${' '.repeat(
    spacer - expGained.length
  )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Required previous project: │ ${prevProj}${' '.repeat(
    spacer - prevProj.length
  )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ User audits requirement:   │ ${auditReq}${' '.repeat(
    spacer - auditReq.length
  )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Language requirement:      │ ${projLanguage}${' '.repeat(
    spacer - projLanguage.length
  )}│
└────────────────────────────┴────────────────${'─'.repeat(strecher)}┘\`\`\``;
  return parseResponse;
};

export default parseProjectInfo;
