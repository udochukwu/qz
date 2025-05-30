import { AcademicSelector } from './academic-selector';
import { Flex, Box } from 'styled-system/jsx';
import { useState } from 'react';
import { NextButton } from '../next-button';
import { useGetSchoolList } from '../../hooks/get-school-list';
import { useGetMajorList } from '../../hooks/get-major-list';
import { SchoolOption, StepPost } from '../../types/onboarding-types';
import { ErrorRetry } from '@/features/user-feedback/error-retry';
import { useTranslation } from 'react-i18next';

interface AcademicInfoSelectorProps {
  submitStep: (stepData: StepPost) => void;
}

const AcademicInfoSelector = ({ submitStep }: AcademicInfoSelectorProps) => {
  const { t } = useTranslation();

  const [school, setSchool] = useState<string>('');
  const [major, setMajor] = useState<string>('');

  const {
    data: schools = [],
    isError: isErrorSchools,
    isLoading: isLoadingSchools,
    refetch: refetchSchool,
  } = useGetSchoolList();

  const { data: majors, isError: isErrorMajors, isLoading: isLoadingMajors, refetch: refetchMajor } = useGetMajorList();

  if (isErrorSchools || isErrorMajors) {
    return (
      <ErrorRetry
        error={t('onboarding.academic.error')}
        retry={() => {
          refetchMajor();
          refetchSchool();
        }}
      />
    );
  }

  const getListofSchoolNames = (schools: SchoolOption[]): string[] => {
    return schools.map(school => school.name);
  };

  const getSchoolId = (schools: SchoolOption[], schoolName: string): string => {
    return schools.find(school => school.name === schoolName)?.school_id ?? '';
  };

  const schoolNames = getListofSchoolNames(schools || []);

  const selectedSchool = getSchoolId(schools, school);

  const getMajorsList = (majors: string[]): string[] => {
    return majors;
  };

  const majorsList = getMajorsList(majors || []);

  return (
    <Flex gap={'3rem'} bg="#FBFBFA" flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
      <Box color="#5C5C5C" fontWeight={'600'} fontSize={'2rem'} textAlign={'center'}>
        <span>{t('onboarding.academic.title')}</span>
        <Box color="#5C5C5C" fontWeight={'400'} fontSize={'1rem'} p={'0.5rem'}>
          {t('onboarding.academic.description')}
        </Box>
      </Box>
      <Flex gap={10} flexDirection={'column'}>
        <AcademicSelector
          allOptions={schoolNames}
          option={school}
          setOption={setSchool}
          isLoading={isLoadingSchools}
          thePrompt={t('common.select.school')}
          theName={t('onboarding.academic.college')}
        />
        <AcademicSelector
          allOptions={majorsList || []}
          isLoading={isLoadingMajors}
          option={major}
          setOption={setMajor}
          thePrompt={t('common.select.major')}
          theName={t('onboarding.academic.major')}
        />
      </Flex>
      <NextButton
        isEnabled={selectedSchool.length > 0 && major.length > 0}
        updateProgress={() => submitStep({ school: selectedSchool, majors: [major] })}
      />
    </Flex>
  );
};
export default AcademicInfoSelector;
