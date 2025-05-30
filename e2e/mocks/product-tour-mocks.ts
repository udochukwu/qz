import { Page } from '@playwright/test';

export async function setupProductTourMocks(page: Page) {
  // Mock product tour status API to ensure tour starts
  await page.route('**/user/product_tour', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ product_tour_completed: false }),
    });
  });

  await page.route('**/user/v2/onboarding', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ is_onboarded: true, steps: { study_level_step: false, questions: [] } }),
    });
  });

  await page.route('**/user/tooltips', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        tooltips: {
          show_about_classes: true,
          show_about_files: true,
          show_about_references: true,
        },
      }),
    });
  });

  await page.route('**/chat/list', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        workspace_chats: [
          {
            workspace_id: 'test-workspace-id',
            class_name: '📚 Test class',
            chats: [],
          },
          {
            workspace_id: 'test-workspace-id',
            class_name: '📚 New class',
            chats: [],
          },
        ],
        unassigned_chats: [],
      }),
    });
  });

  await page.route('**/workspace/list', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        classes: [
          {
            class_name: '📚 Test Class',
            workspace_id: 'test-workspace-id',
            number_of_files: 0,
            created_at: 1744988656,
            updated_at: 1744988656,
          },
        ],
      }),
    });
  });

  await page.route('**/files', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ files: [] }),
    });
  });

  await page.route('**/workspaces', route => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ workspace_id: 'test-workspace-id' }),
      });
    }
  });

  await page.route('**/share/import**', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ id: 'test-chat-id' }),
    });
  });

  await page.route('**/workspace/create', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        message: 'Workspace created successfully with name: 📚 Test class',
        workspace_id: 'test-workspace-id',
      }),
    });
  });

  await page.route('**/quiz/recents', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ quizzes: [] }),
    });
  });

  await page.route('**/user/quests', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        quest_completed: false,
        quest_data: {
          finish_on_boarding: true,
          upload_file: false,
          ask_a_question: false,
          create_class: true,
          explainer_video: true,
        },
      }),
    });
  });

  await page.route('**/share', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 'test-chat-id',
        type: 'chat',
        message: 'Chat imported successfully.',
      }),
    });
  });

  await page.route('**/files?workspace_id=test-workspace-id', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ files: [] }),
    });
  });

  await page.route('**/files?chat_id=test-chat-id', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        files: [
          {
            filename: 'An example of notes.pdf',
            url: 'https://coursegpt.blob.core.windows.net/raw-files/ad3197ed-b30e-4425-94bc-e2cab34717bb/Economics%20Notes.pdf?st=2025-04-24T09%3A20%3A38Z&se=2025-04-24T09%3A55%3A38Z&sp=r&sv=2023-11-03&sr=b&sig=y854Z1nzXlioLs1lXiPY2oCZZ9oe16/qAuW771EYs/A%3D',
            workspace_file_id: 'test-workspace-file-id',
            workspace_id: 'test-workspace-id',
            is_class: false,
            class_name: null,
            created_at: 1745487292,
            last_modified: 1745487292,
            status: 'finished',
            completion_percentage: 100.0,
            enabled: true,
          },
        ],
      }),
    });
  });

  await page.route('**/chat/test-chat-id/suggestion', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        {
          suggestion_id: null,
          file_id: null,
          message: 'Summarize this',
          suggestion_type: 'default',
        },
        {
          suggestion_id: null,
          file_id: null,
          message: 'Create a study note',
          suggestion_type: 'default',
        },
      ]),
    });
  });

  await page.route('**/chat/test-chat-id', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        chat_id: 'test-chat-id',
        chat_title: 'An example of notes.pdf',
        chat_desc: 'Untitled Chat',
        is_class_chat: false,
        number_of_files: 1,
        last_message_id: null,
        last_message_at: null,
        workspace_id: 'test-workspace-id',
        messages: [],
        pro_required: false,
      }),
    });
  });
}

export async function setupCompletedProductTourMock(page: Page) {
  await page.route('**/user/product_tour', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ product_tour_completed: true }),
    });
  });
}
