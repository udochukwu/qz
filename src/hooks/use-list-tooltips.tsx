import axiosClient from '@/lib/axios';
import { TooltipsProps, SetTooltipParams } from '@/types';
import { UseQueryResult, useQuery, useMutation, useQueryClient } from 'react-query';
import { queryClient } from '@/providers/Providers';
const fetchTooltips = async (): Promise<TooltipsProps> => {
  const res = await axiosClient.get<TooltipsProps>('/user/tooltips');
  return res?.data;
};

export const useListTooltips = (): UseQueryResult<TooltipsProps> => {
  return useQuery('list-tooltips', fetchTooltips, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

const postTooltip = async ({ guideId, showTooltip }: SetTooltipParams): Promise<void> => {
  await axiosClient.post('/user/tooltip', { tooltip_name: guideId, show_tooltip: showTooltip });
};

// update the query result to set the specific tooltip to false
const setTooltipFalse = (guideId: string): void => {
  queryClient.setQueryData<TooltipsProps>('list-tooltips', oldData => {
    if (!oldData) {
      throw new Error('ToolTip data not found');
    }
    return {
      tooltips: {
        ...oldData.tooltips,
        [guideId]: false,
      },
    };
  });
};

export const useSetTooltip = (guideId: string, showTooltip: boolean) => {
  return useMutation(() => postTooltip({ guideId, showTooltip }), {
    onSuccess: () => {
      //queryClient.invalidateQueries('list-tooltips'); instead of invalidating the query, we can just update the query result
      setTooltipFalse(guideId);
    },
  });
};
