export const TEST_DATA__promote_template_query_entities = [
  {
    path: 'test::README',
    classifierPath: 'meta::pure::metamodel::text::Text',
    content: {
      _type: 'text',
      content: 'This is example for DSL External Format',
      name: 'README',
      package: 'test',
      type: 'plainText',
    },
  },
  {
    path: 'model::animal::Animal',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      executionContexts: [
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping2',
            type: 'MAPPING',
          },
          name: 'dummyContext2',
        },
        {
          defaultRuntime: {
            path: 'model::dummyRuntime2',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping2',
            type: 'MAPPING',
          },
          name: 'dummyContext3',
        },
      ],
      featuredDiagrams: [
        {
          path: 'model::animal::AnimalDiagram',
          type: 'DIAGRAM',
        },
        {
          path: 'model::GeneralDiagram',
          type: 'DIAGRAM',
        },
      ],
      name: 'Animal',
      package: 'model::animal',
      stereotypes: [
        {
          profile: 'doc',
          value: 'deprecated',
        },
      ],
      supportInfo: {
        _type: 'email',
        address: 'someEmail@test.org',
      },
      taggedValues: [
        {
          tag: {
            profile: 'meta::pure::profiles::enterprise',
            value: 'taxonomyNodes',
          },
          value: 'abcdxyz005',
        },
        {
          tag: {
            profile: 'doc',
            value: 'doc',
          },
          value: 'Lorem ipsum',
        },
        {
          tag: {
            profile: 'doc',
            value: 'doc',
          },
          value: 'Lorem ipsum2',
        },
      ],
      title: 'Animal',
    },
  },
  {
    path: 'model::vehicle::car::Car1',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      executionContexts: [
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
      ],
      name: 'Car1',
      package: 'model::vehicle::car',
      stereotypes: [],
      taggedValues: [
        {
          tag: {
            profile: 'meta::pure::profiles::enterprise',
            value: 'taxonomyNodes',
          },
          value: 'abcdxyz004',
        },
      ],
    },
  },
  {
    path: 'model::animal::GenericAnimal',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'GenericAnimal',
      originalMilestonedProperties: [],
      package: 'model::animal',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'age',
          stereotypes: [],
          taggedValues: [],
          type: 'Number',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::dummyMapping',
    classifierPath: 'meta::pure::mapping::Mapping',
    content: {
      _type: 'mapping',
      associationMappings: [],
      classMappings: [],
      enumerationMappings: [],
      includedMappings: [],
      name: 'dummyMapping',
      package: 'model',
      tests: [],
    },
  },
  {
    path: 'model::animal::reptile::Reptile1',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      executionContexts: [
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
      ],
      name: 'Reptile1',
      package: 'model::animal::reptile',
      stereotypes: [],
      supportInfo: {
        _type: 'email',
        address: 'someEmail@test.org',
      },
      taggedValues: [
        {
          tag: {
            profile: 'meta::pure::profiles::enterprise',
            value: 'taxonomyNodes',
          },
          value: 'abcdxyz006',
        },
        {
          tag: {
            profile: 'doc',
            value: 'doc',
          },
          value: 'Lorem ipsum',
        },
        {
          tag: {
            profile: 'doc',
            value: 'doc',
          },
          value: 'Lorem ipsum2',
        },
      ],
      title:
        'Long Title - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna al',
    },
  },
  {
    path: 'test::trade::SelfMapping',
    classifierPath: 'meta::pure::mapping::Mapping',
    content: {
      _type: 'mapping',
      associationMappings: [],
      classMappings: [],
      enumerationMappings: [],
      includedMappings: [],
      name: 'SelfMapping',
      package: 'test::trade',
      tests: [],
    },
  },
  {
    path: 'model::animal::AnimalDiagram',
    classifierPath: 'meta::pure::metamodel::diagram::Diagram',
    content: {
      _type: 'diagram',
      classViews: [
        {
          class: 'model::animal::mammal::Mammal',
          id: '641a0336-d4b5-418c-b656-2f52461264e2',
          position: {
            x: 427,
            y: 210,
          },
          rectangle: {
            height: 170,
            width: 176.47607421875,
          },
        },
        {
          class: 'model::animal::reptile::Reptile',
          id: 'b92253d8-0389-4c7d-b5d2-3cdc3bb1ad98',
          position: {
            x: 787,
            y: 216,
          },
          rectangle: {
            height: 100,
            width: 223.53759765625,
          },
        },
        {
          class: 'model::animal::mammal::Mammal',
          id: 'ffe27b04-5c70-4406-ba46-251c13b84494',
          position: {
            x: 687.423828125,
            y: 441.5,
          },
          rectangle: {
            height: 170,
            width: 176.47607421875,
          },
        },
        {
          class: 'model::animal::reptile::Reptile',
          id: '165fc83b-1c4b-4508-a593-004a14430d4c',
          position: {
            x: 694.504150390625,
            y: 329.25,
          },
          rectangle: {
            height: 86,
            width: 223.53759765625,
          },
        },
      ],
      generalizationViews: [],
      name: 'AnimalDiagram',
      package: 'model::animal',
      propertyViews: [
        {
          line: {
            points: [
              {
                x: 806.27294921875,
                y: 372.25,
              },
              {
                x: 515.238037109375,
                y: 295,
              },
            ],
          },
          property: {
            class: 'model::animal::reptile::Reptile',
            property: 'mammalRelative',
          },
          sourceView: '165fc83b-1c4b-4508-a593-004a14430d4c',
          targetView: '641a0336-d4b5-418c-b656-2f52461264e2',
        },
        {
          line: {
            points: [
              {
                x: 515.238037109375,
                y: 295,
              },
              {
                x: 806.27294921875,
                y: 372.25,
              },
            ],
          },
          property: {
            class: 'model::animal::mammal::Mammal',
            property: 'reptileRelative',
          },
          sourceView: '641a0336-d4b5-418c-b656-2f52461264e2',
          targetView: '165fc83b-1c4b-4508-a593-004a14430d4c',
        },
        {
          line: {
            points: [
              {
                x: 806.27294921875,
                y: 372.25,
              },
              {
                x: 775.661865234375,
                y: 526.5,
              },
            ],
          },
          property: {
            class: 'model::animal::reptile::Reptile',
            property: 'mammalRelative',
          },
          sourceView: '165fc83b-1c4b-4508-a593-004a14430d4c',
          targetView: 'ffe27b04-5c70-4406-ba46-251c13b84494',
        },
        {
          line: {
            points: [
              {
                x: 775.661865234375,
                y: 526.5,
              },
              {
                x: 806.27294921875,
                y: 372.25,
              },
            ],
          },
          property: {
            class: 'model::animal::mammal::Mammal',
            property: 'reptileRelative',
          },
          sourceView: 'ffe27b04-5c70-4406-ba46-251c13b84494',
          targetView: '165fc83b-1c4b-4508-a593-004a14430d4c',
        },
      ],
    },
  },
  {
    path: 'model::animal::StrangeAssociation',
    classifierPath: 'meta::pure::metamodel::relationship::Association',
    content: {
      _type: 'association',
      name: 'StrangeAssociation',
      originalMilestonedProperties: [],
      package: 'model::animal',
      properties: [
        {
          multiplicity: {
            lowerBound: 0,
          },
          name: 'reptileRelative',
          stereotypes: [],
          taggedValues: [],
          type: 'model::animal::reptile::Reptile',
        },
        {
          multiplicity: {
            lowerBound: 0,
          },
          name: 'mammalRelative',
          stereotypes: [],
          taggedValues: [],
          type: 'model::animal::mammal::Mammal',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::vehicle::plane::Aircraft',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      executionContexts: [
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
      ],
      name: 'Aircraft',
      package: 'model::vehicle::plane',
      stereotypes: [],
      taggedValues: [
        {
          tag: {
            profile: 'meta::pure::profiles::enterprise',
            value: 'taxonomyNodes',
          },
          value: 'abcdxyz002',
        },
      ],
    },
  },
  {
    path: 'model::weapon::Sword',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Sword',
      originalMilestonedProperties: [],
      package: 'model::weapon',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'length',
          stereotypes: [],
          taggedValues: [],
          type: 'Number',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::animal::mammal::Something',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Something',
      originalMilestonedProperties: [],
      package: 'model::animal::mammal',
      properties: [],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::animal::mammal::Mammal',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Mammal',
      originalMilestonedProperties: [],
      package: 'model::animal::mammal',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'noOfLegs',
          stereotypes: [],
          taggedValues: [],
          type: 'Number',
        },
        {
          multiplicity: {
            lowerBound: 0,
          },
          name: 'children',
          stereotypes: [],
          taggedValues: [],
          type: 'model::animal::GenericAnimal',
        },
      ],
      qualifiedProperties: [
        {
          body: [
            {
              _type: 'func',
              function: 'greaterThan',
              parameters: [
                {
                  _type: 'property',
                  parameters: [
                    {
                      _type: 'var',
                      name: 'this',
                    },
                  ],
                  property: 'noOfLegs',
                },
                {
                  _type: 'integer',
                  multiplicity: {
                    lowerBound: 1,
                    upperBound: 1,
                  },
                  values: [4],
                },
              ],
            },
          ],
          name: 'moreThan4Legs',
          parameters: [],
          returnMultiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          returnType: 'Boolean',
          stereotypes: [],
          taggedValues: [],
        },
        {
          body: [
            {
              _type: 'collection',
              multiplicity: {
                lowerBound: 0,
                upperBound: 0,
              },
              values: [],
            },
          ],
          name: 'something',
          parameters: [],
          returnMultiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          returnType: 'model::animal::mammal::Something',
          stereotypes: [],
          taggedValues: [],
        },
      ],
      stereotypes: [
        {
          profile: 'meta::pure::profiles::doc',
          value: 'deprecated',
        },
        {
          profile: 'model::animal::mammal::AnimalProfile',
          value: 'Evolved',
        },
      ],
      superTypes: [],
      taggedValues: [
        {
          tag: {
            profile: 'meta::pure::profiles::doc',
            value: 'doc',
          },
          value: 'Mammal',
        },
        {
          tag: {
            profile: 'model::animal::mammal::AnimalProfile',
            value: 'X',
          },
          value: 'xxxx',
        },
        {
          tag: {
            profile: 'model::animal::mammal::AnimalProfile',
            value: 'Y',
          },
          value: 'yyyyy',
        },
      ],
    },
  },
  {
    path: 'model::vehicle::car::Car',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Car',
      originalMilestonedProperties: [],
      package: 'model::vehicle::car',
      properties: [],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::AnimalService',
    classifierPath: 'meta::legend::service::metamodel::Service',
    content: {
      _type: 'service',
      autoActivateUpdates: true,
      documentation: '',
      execution: {
        _type: 'pureMultiExecution',
        executionKey: 'env',
        executionParameters: [
          {
            key: 'PROD',
            mapping: 'model::MammalMapping',
            runtime: {
              _type: 'runtimePointer',
              runtime: 'model::MammalRuntime',
            },
          },
          {
            key: 'DEV',
            mapping: 'model::MammalMapping',
            runtime: {
              _type: 'runtimePointer',
              runtime: 'model::MammalRuntime',
            },
          },
        ],
        func: {
          _type: 'lambda',
          body: [
            {
              _type: 'func',
              function: 'serialize',
              parameters: [
                {
                  _type: 'func',
                  function: 'graphFetchChecked',
                  parameters: [
                    {
                      _type: 'func',
                      function: 'getAll',
                      parameters: [
                        {
                          _type: 'packageableElementPtr',
                          fullPath: 'model::animal::mammal::Mammal',
                        },
                      ],
                    },
                    {
                      _type: 'rootGraphFetchTree',
                      class: 'model::animal::mammal::Mammal',
                      subTrees: [
                        {
                          _type: 'propertyGraphFetchTree',
                          parameters: [],
                          property: 'noOfLegs',
                          subTrees: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  _type: 'rootGraphFetchTree',
                  class: 'model::animal::mammal::Mammal',
                  subTrees: [
                    {
                      _type: 'propertyGraphFetchTree',
                      parameters: [],
                      property: 'noOfLegs',
                      subTrees: [],
                    },
                  ],
                },
              ],
            },
          ],
          parameters: [],
        },
      },
      name: 'AnimalService',
      owners: ['anonymous', 'akphi'],
      package: 'model',
      pattern: '/f05834b2-892f-4773-9ea0-77c552cd3ac6',
      stereotypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::OldModelRef_V2_3_0',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      description: 'A data space that points at the old model of version 2.3.0',
      executionContexts: [
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
      ],
      name: 'OldModelRef_V2_3_0',
      package: 'model',
      stereotypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::animal::reptile::ClassificationInfo',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'ClassificationInfo',
      originalMilestonedProperties: [],
      package: 'model::animal::reptile',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'id',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::animal::reptile::Reptile',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Reptile',
      originalMilestonedProperties: [],
      package: 'model::animal::reptile',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'hasFin',
          stereotypes: [],
          taggedValues: [],
          type: 'Boolean',
        },
        {
          multiplicity: {
            lowerBound: 0,
          },
          name: 'children',
          stereotypes: [],
          taggedValues: [],
          type: 'model::animal::GenericAnimal',
        },
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'type',
          stereotypes: [],
          taggedValues: [],
          type: 'model::animal::reptile::ReptileClassification',
        },
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'classificationInfo',
          stereotypes: [],
          taggedValues: [],
          type: 'model::animal::reptile::ClassificationInfo',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'domain::Demographics',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Demographics',
      originalMilestonedProperties: [],
      package: 'domain',
      properties: [
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'fips',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'state',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'domain::COVIDDatapace',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      description: 'Not over yet?',
      executables: [
        {
          _type: 'dataSpaceTemplateExecutable',
          title: 'template query title',
          id: 'my_id',
          query: {
            _type: 'lambda',
            body: [
              {
                _type: 'func',
                function: 'project',
                parameters: [
                  {
                    _type: 'func',
                    function: 'getAll',
                    parameters: [
                      {
                        _type: 'packageableElementPtr',
                        fullPath: 'domain::COVIDData',
                      },
                    ],
                  },
                  {
                    _type: 'collection',
                    multiplicity: {
                      lowerBound: 1,
                      upperBound: 1,
                    },
                    values: [
                      {
                        _type: 'lambda',
                        body: [
                          {
                            _type: 'property',
                            parameters: [
                              {
                                _type: 'var',
                                name: 'x',
                              },
                            ],
                            property: 'cases',
                          },
                        ],
                        parameters: [
                          {
                            _type: 'var',
                            name: 'x',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    _type: 'collection',
                    multiplicity: {
                      lowerBound: 1,
                      upperBound: 1,
                    },
                    values: [
                      {
                        _type: 'string',
                        value: 'Cases',
                      },
                    ],
                  },
                ],
              },
            ],
            parameters: [],
          },
          description: 'this is template query description',
          executionContextKey: 'dummyContext',
        },
      ],
      executionContexts: [
        {
          defaultRuntime: {
            path: 'runtime::H2Runtime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'mapping::CovidDataMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
        {
          defaultRuntime: {
            path: 'runtime::H2Runtime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'mapping::CovidDataMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext2',
        },
      ],
      featuredDiagrams: [
        {
          path: 'domain::COVIDDataDiagram',
          type: 'DIAGRAM',
        },
      ],
      name: 'COVIDDatapace',
      package: 'domain',
      stereotypes: [],
      taggedValues: [],
      title: 'COVID Sample Data',
    },
  },
  {
    path: 'model::vehicle::plane::Plane',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Plane',
      originalMilestonedProperties: [],
      package: 'model::vehicle::plane',
      properties: [],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::animal::mammal::Mammal1',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      executionContexts: [
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
      ],
      name: 'Mammal1',
      package: 'model::animal::mammal',
      stereotypes: [],
      taggedValues: [
        {
          tag: {
            profile: 'meta::pure::profiles::enterprise',
            value: 'taxonomyNodes',
          },
          value: 'abcdxyz003,abcdxyz002',
        },
      ],
      title: 'Mammal Diagram',
    },
  },
  {
    path: 'model::dummyMapping2',
    classifierPath: 'meta::pure::mapping::Mapping',
    content: {
      _type: 'mapping',
      associationMappings: [],
      classMappings: [],
      enumerationMappings: [],
      includedMappings: [],
      name: 'dummyMapping2',
      package: 'model',
      tests: [],
    },
  },
  {
    path: 'runtime::H2Runtime',
    classifierPath: 'meta::pure::runtime::PackageableRuntime',
    content: {
      _type: 'runtime',
      name: 'H2Runtime',
      package: 'runtime',
      runtimeValue: {
        _type: 'engineRuntime',
        connections: [
          {
            store: {
              path: 'store::CovidDataStore',
              type: 'STORE',
            },
            storeConnections: [
              {
                connection: {
                  _type: 'connectionPointer',
                  connection: 'runtime::connection::H2Connection',
                },
                id: 'connection_1',
              },
            ],
          },
        ],
        mappings: [
          {
            path: 'mapping::CovidDataMapping',
            type: 'MAPPING',
          },
        ],
      },
    },
  },
  {
    path: 'domain::COVIDDataDiagram',
    classifierPath: 'meta::pure::metamodel::diagram::Diagram',
    content: {
      _type: 'diagram',
      classViews: [
        {
          class: 'domain::COVIDData',
          id: '6b69f44b-f729-46aa-b244-ec5ee8164142',
          position: {
            x: 280,
            y: 159,
          },
          rectangle: {
            height: 128,
            width: 205.8291015625,
          },
        },
        {
          class: 'domain::Demographics',
          id: '159e797e-ae75-437d-ba9c-253f99a48826',
          position: {
            x: 698,
            y: 238,
          },
          rectangle: {
            height: 58,
            width: 111.68994140625,
          },
        },
        {
          class: 'domain::Class1',
          id: 'f6bd8a50-8d18-4bd9-9a8d-7fad88d02b07',
          position: {
            x: 360.844970703125,
            y: 49,
          },
          rectangle: {
            height: 58,
            width: 137.390625,
          },
        },
        {
          class: 'domain::Class2',
          id: '690e89d4-23e9-46e8-8543-c89c22cc9e15',
          position: {
            x: 696.844970703125,
            y: 95,
          },
          rectangle: {
            height: 44,
            width: 133.68994140625,
          },
        },
      ],
      generalizationViews: [],
      name: 'COVIDDataDiagram',
      package: 'domain',
      propertyViews: [
        {
          line: {
            points: [
              {
                x: 382.91455078125,
                y: 223,
              },
              {
                x: 753.844970703125,
                y: 267,
              },
            ],
          },
          property: {
            class: 'domain::COVIDData',
            property: 'demographics',
          },
          sourceView: '6b69f44b-f729-46aa-b244-ec5ee8164142',
          targetView: '159e797e-ae75-437d-ba9c-253f99a48826',
        },
        {
          line: {
            points: [
              {
                x: 763.68994140625,
                y: 117,
              },
              {
                x: 429.540283203125,
                y: 78,
              },
            ],
          },
          property: {
            class: 'domain::Class2',
            property: 'fromClass1',
          },
          sourceView: '690e89d4-23e9-46e8-8543-c89c22cc9e15',
          targetView: 'f6bd8a50-8d18-4bd9-9a8d-7fad88d02b07',
        },
        {
          line: {
            points: [
              {
                x: 429.540283203125,
                y: 78,
              },
              {
                x: 763.68994140625,
                y: 117,
              },
            ],
          },
          property: {
            class: 'domain::Class1',
            property: 'fromClass2',
          },
          sourceView: 'f6bd8a50-8d18-4bd9-9a8d-7fad88d02b07',
          targetView: '690e89d4-23e9-46e8-8543-c89c22cc9e15',
        },
      ],
    },
  },
  {
    path: 'model::dummyRuntime',
    classifierPath: 'meta::pure::runtime::PackageableRuntime',
    content: {
      _type: 'runtime',
      name: 'dummyRuntime',
      package: 'model',
      runtimeValue: {
        _type: 'engineRuntime',
        connections: [],
        mappings: [
          {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          {
            path: 'model::dummyMapping2',
            type: 'MAPPING',
          },
        ],
      },
    },
  },
  {
    path: 'model::GeneralDiagram',
    classifierPath: 'meta::pure::metamodel::diagram::Diagram',
    content: {
      _type: 'diagram',
      classViews: [],
      generalizationViews: [],
      name: 'GeneralDiagram',
      package: 'model',
      propertyViews: [],
    },
  },
  {
    path: 'test::gen::Trade',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Trade',
      originalMilestonedProperties: [],
      package: 'test::gen',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'product',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'quantity',
          stereotypes: [],
          taggedValues: [],
          type: 'Integer',
        },
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'tradeTime',
          stereotypes: [],
          taggedValues: [],
          type: 'DateTime',
        },
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'price',
          stereotypes: [],
          taggedValues: [],
          type: 'Float',
        },
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'priceCcy',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'settlementCcy',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'settlementRate',
          stereotypes: [],
          taggedValues: [],
          type: 'Float',
        },
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'settlementDate',
          stereotypes: [],
          taggedValues: [],
          type: 'StrictDate',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'confirmedAt',
          stereotypes: [],
          taggedValues: [],
          type: 'DateTime',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'expiryDate',
          stereotypes: [],
          taggedValues: [],
          type: 'StrictDate',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'executions',
          stereotypes: [],
          taggedValues: [],
          type: 'Integer',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'model::animal::mammal::AnimalProfile',
    classifierPath: 'meta::pure::metamodel::extension::Profile',
    content: {
      _type: 'profile',
      name: 'AnimalProfile',
      package: 'model::animal::mammal',
      stereotypes: ['Evolved'],
      tags: ['X', 'Y'],
    },
  },
  {
    path: 'model::vehicle::Vehicle',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      executionContexts: [
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping2',
            type: 'MAPPING',
          },
          name: 'dummyContext2',
        },
        {
          defaultRuntime: {
            path: 'model::dummyRuntime2',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping2',
            type: 'MAPPING',
          },
          name: 'dummyContext3',
        },
      ],
      featuredDiagrams: [
        {
          path: 'model::vehicle::VehicleDiagram',
          type: 'DIAGRAM',
        },
      ],
      name: 'Vehicle',
      package: 'model::vehicle',
      stereotypes: [],
      taggedValues: [
        {
          tag: {
            profile: 'meta::pure::profiles::enterprise',
            value: 'taxonomyNodes',
          },
          value: 'abcdxyz001',
        },
      ],
      title: 'Vehicle',
    },
  },
  {
    path: 'model::animal::reptile::ReptileClassification',
    classifierPath: 'meta::pure::metamodel::type::Enumeration',
    content: {
      _type: 'Enumeration',
      name: 'ReptileClassification',
      package: 'model::animal::reptile',
      stereotypes: [],
      taggedValues: [],
      values: [
        {
          stereotypes: [],
          taggedValues: [],
          value: 'TYPE1',
        },
      ],
    },
  },
  {
    path: 'model::vehicle::VehicleDiagram',
    classifierPath: 'meta::pure::metamodel::diagram::Diagram',
    content: {
      _type: 'diagram',
      classViews: [],
      generalizationViews: [],
      name: 'VehicleDiagram',
      package: 'model::vehicle',
      propertyViews: [],
    },
  },
  {
    path: 'model::MammalMapping',
    classifierPath: 'meta::pure::mapping::Mapping',
    content: {
      _type: 'mapping',
      associationMappings: [],
      classMappings: [
        {
          _type: 'pureInstance',
          class: 'model::animal::mammal::Mammal',
          propertyMappings: [
            {
              _type: 'purePropertyMapping',
              explodeProperty: false,
              property: {
                class: 'model::animal::mammal::Mammal',
                property: 'noOfLegs',
              },
              source: '',
              transform: {
                _type: 'lambda',
                body: [
                  {
                    _type: 'integer',
                    multiplicity: {
                      lowerBound: 1,
                      upperBound: 1,
                    },
                    values: [4],
                  },
                ],
                parameters: [],
              },
            },
          ],
          root: true,
          srcClass: 'model::animal::mammal::Mammal',
        },
      ],
      enumerationMappings: [],
      includedMappings: [],
      name: 'MammalMapping',
      package: 'model',
      tests: [],
    },
  },
  {
    path: 'model::MammalRuntime',
    classifierPath: 'meta::pure::runtime::PackageableRuntime',
    content: {
      _type: 'runtime',
      name: 'MammalRuntime',
      package: 'model',
      runtimeValue: {
        _type: 'engineRuntime',
        connections: [
          {
            store: {
              path: 'ModelStore',
              type: 'STORE',
            },
            storeConnections: [
              {
                connection: {
                  _type: 'JsonModelConnection',
                  class: 'model::animal::mammal::Mammal',
                  url: 'data:application/json,%7B%22noOfLegs%22%3A%22noOfLegs%203%22%7D',
                },
                id: 'connection_1',
              },
            ],
          },
        ],
        mappings: [
          {
            path: 'model::MammalMapping',
            type: 'MAPPING',
          },
        ],
      },
    },
  },
  {
    path: 'model::dummyRuntime2',
    classifierPath: 'meta::pure::runtime::PackageableRuntime',
    content: {
      _type: 'runtime',
      name: 'dummyRuntime2',
      package: 'model',
      runtimeValue: {
        _type: 'engineRuntime',
        connections: [],
        mappings: [
          {
            path: 'model::dummyMapping2',
            type: 'MAPPING',
          },
        ],
      },
    },
  },
  {
    path: 'domain::Class12Assoc',
    classifierPath: 'meta::pure::metamodel::relationship::Association',
    content: {
      _type: 'association',
      name: 'Class12Assoc',
      originalMilestonedProperties: [],
      package: 'domain',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'fromClass1',
          stereotypes: [],
          taggedValues: [],
          type: 'domain::Class1',
        },
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'fromClass2',
          stereotypes: [],
          taggedValues: [],
          type: 'domain::Class2',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'store::CovidDataStore',
    classifierPath: 'meta::relational::metamodel::Database',
    content: {
      _type: 'relational',
      filters: [],
      includedStores: [],
      joins: [
        {
          name: 'CovidDataDemographicsJoin',
          operation: {
            _type: 'dynaFunc',
            funcName: 'equal',
            parameters: [
              {
                _type: 'column',
                column: 'FIPS',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'DEMOGRAPHICS',
                },
                tableAlias: 'DEMOGRAPHICS',
              },
              {
                _type: 'column',
                column: 'FIPS',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'COVID_DATA',
                },
                tableAlias: 'COVID_DATA',
              },
            ],
          },
        },
      ],
      name: 'CovidDataStore',
      package: 'store',
      schemas: [
        {
          name: 'default',
          tables: [
            {
              columns: [
                {
                  name: 'FIPS',
                  nullable: true,
                  type: {
                    _type: 'Varchar',
                    size: 200,
                  },
                },
                {
                  name: 'STATE',
                  nullable: true,
                  type: {
                    _type: 'Varchar',
                    size: 200,
                  },
                },
              ],
              milestoning: [],
              name: 'DEMOGRAPHICS',
              primaryKey: [],
            },
            {
              columns: [
                {
                  name: 'ID',
                  nullable: false,
                  type: {
                    _type: 'Integer',
                  },
                },
                {
                  name: 'FIPS',
                  nullable: true,
                  type: {
                    _type: 'Varchar',
                    size: 200,
                  },
                },
                {
                  name: 'DATE',
                  nullable: true,
                  type: {
                    _type: 'Date',
                  },
                },
                {
                  name: 'CASE_TYPE',
                  nullable: true,
                  type: {
                    _type: 'Varchar',
                    size: 200,
                  },
                },
                {
                  name: 'CASES',
                  nullable: true,
                  type: {
                    _type: 'Integer',
                  },
                },
                {
                  name: 'LAST_REPORTED_FLAG',
                  nullable: true,
                  type: {
                    _type: 'Bit',
                  },
                },
              ],
              milestoning: [],
              name: 'COVID_DATA',
              primaryKey: ['ID'],
            },
          ],
          views: [],
        },
      ],
    },
  },
  {
    path: 'model::NoDiagram',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      description: 'A really sad data space with no care and diagram',
      executionContexts: [
        {
          defaultRuntime: {
            path: 'model::dummyRuntime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'model::dummyMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
      ],
      name: 'NoDiagram',
      package: 'model',
      stereotypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'runtime::connection::H2Connection',
    classifierPath: 'meta::pure::runtime::PackageableConnection',
    content: {
      _type: 'connection',
      connectionValue: {
        _type: 'RelationalDatabaseConnection',
        authenticationStrategy: {
          _type: 'h2Default',
        },
        databaseType: 'H2',
        datasourceSpecification: {
          _type: 'h2Local',
          testDataSetupSqls: [
            "DROP TABLE IF EXISTS COVID_DATA;\nDROP TABLE IF EXISTS DEMOGRAPHICS;\n\nCREATE TABLE DEMOGRAPHICS(\n  FIPS VARCHAR(200) PRIMARY KEY,\n  STATE VARCHAR(200)\n);\n\nCREATE TABLE COVID_DATA(\n  ID INT PRIMARY KEY,\n  FIPS VARCHAR(200),\n  DATE DATE,\n  CASE_TYPE VARCHAR(200),\n  CASES INT,\n  LAST_REPORTED_FLAG BIT,\n  FOREIGN KEY (FIPS) REFERENCES DEMOGRAPHICS(FIPS)\n);\n\nINSERT INTO DEMOGRAPHICS VALUES('1', 'NY');\nINSERT INTO DEMOGRAPHICS VALUES('2', 'NJ');\nINSERT INTO DEMOGRAPHICS VALUES('3', 'CA');\n\nINSERT INTO COVID_DATA VALUES(1, '1', '2021-04-01', 'Confirmed', 405, 0);\nINSERT INTO COVID_DATA VALUES(2, '2', '2021-04-01', 'Active', 290, 1);\n",
          ],
        },
        element: 'store::CovidDataStore',
        postProcessorWithParameter: [],
        type: 'H2',
      },
      name: 'H2Connection',
      package: 'runtime::connection',
    },
  },
  {
    path: 'domain::Class1',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Class1',
      originalMilestonedProperties: [],
      package: 'domain',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'propClass1',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [
        {
          profile: 'meta::pure::profiles::temporal',
          value: 'businesstemporal',
        },
      ],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'domain::COVIDData',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'COVIDData',
      originalMilestonedProperties: [],
      package: 'domain',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'id',
          stereotypes: [],
          taggedValues: [],
          type: 'Integer',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'fips',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'date',
          stereotypes: [],
          taggedValues: [],
          type: 'StrictDate',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'caseType',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'cases',
          stereotypes: [],
          taggedValues: [],
          type: 'Float',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'lastReportedFlag',
          stereotypes: [],
          taggedValues: [],
          type: 'Boolean',
        },
        {
          multiplicity: {
            lowerBound: 0,
            upperBound: 1,
          },
          name: 'demographics',
          stereotypes: [],
          taggedValues: [],
          type: 'domain::Demographics',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'service::CovidDataMulti',
    classifierPath: 'meta::legend::service::metamodel::Service',
    content: {
      _type: 'service',
      autoActivateUpdates: true,
      documentation: '',
      execution: {
        _type: 'pureMultiExecution',
        executionKey: 'env',
        executionParameters: [
          {
            key: 'PROD',
            mapping: 'mapping::CovidDataMapping',
            runtime: {
              _type: 'runtimePointer',
              runtime: 'runtime::H2Runtime',
            },
          },
          {
            key: 'DEV',
            mapping: 'mapping::CovidDataMapping',
            runtime: {
              _type: 'runtimePointer',
              runtime: 'runtime::H2Runtime',
            },
          },
        ],
        func: {
          _type: 'lambda',
          body: [
            {
              _type: 'func',
              function: 'project',
              parameters: [
                {
                  _type: 'func',
                  function: 'getAll',
                  parameters: [
                    {
                      _type: 'packageableElementPtr',
                      fullPath: 'domain::COVIDData',
                    },
                  ],
                },
                {
                  _type: 'collection',
                  multiplicity: {
                    lowerBound: 1,
                    upperBound: 1,
                  },
                  values: [
                    {
                      _type: 'lambda',
                      body: [
                        {
                          _type: 'property',
                          parameters: [
                            {
                              _type: 'var',
                              name: 'x',
                            },
                          ],
                          property: 'cases',
                        },
                      ],
                      parameters: [
                        {
                          _type: 'var',
                          name: 'x',
                        },
                      ],
                    },
                  ],
                },
                {
                  _type: 'collection',
                  multiplicity: {
                    lowerBound: 1,
                    upperBound: 1,
                  },
                  values: [
                    {
                      _type: 'string',
                      multiplicity: {
                        lowerBound: 1,
                        upperBound: 1,
                      },
                      values: ['Cases'],
                    },
                  ],
                },
              ],
            },
          ],
          parameters: [],
        },
      },
      name: 'CovidDataMulti',
      owners: ['anonymous', 'akphi'],
      package: 'service',
      pattern: '/9566f101-2108-408f-863f-6d7e154dc17a',
      stereotypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'domain::Class2',
    classifierPath: 'meta::pure::metamodel::type::Class',
    content: {
      _type: 'class',
      constraints: [],
      name: 'Class2',
      originalMilestonedProperties: [],
      package: 'domain',
      properties: [
        {
          multiplicity: {
            lowerBound: 1,
            upperBound: 1,
          },
          name: 'propClass2',
          stereotypes: [],
          taggedValues: [],
          type: 'String',
        },
      ],
      qualifiedProperties: [],
      stereotypes: [
        {
          profile: 'meta::pure::profiles::temporal',
          value: 'processingtemporal',
        },
      ],
      superTypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'service::CovidDataSingle',
    classifierPath: 'meta::legend::service::metamodel::Service',
    content: {
      _type: 'service',
      autoActivateUpdates: true,
      documentation: '',
      execution: {
        _type: 'pureSingleExecution',
        func: {
          _type: 'lambda',
          body: [
            {
              _type: 'func',
              function: 'project',
              parameters: [
                {
                  _type: 'func',
                  function: 'getAll',
                  parameters: [
                    {
                      _type: 'packageableElementPtr',
                      fullPath: 'domain::COVIDData',
                    },
                  ],
                },
                {
                  _type: 'collection',
                  multiplicity: {
                    lowerBound: 1,
                    upperBound: 1,
                  },
                  values: [
                    {
                      _type: 'lambda',
                      body: [
                        {
                          _type: 'property',
                          parameters: [
                            {
                              _type: 'var',
                              name: 'x',
                            },
                          ],
                          property: 'cases',
                        },
                      ],
                      parameters: [
                        {
                          _type: 'var',
                          name: 'x',
                        },
                      ],
                    },
                  ],
                },
                {
                  _type: 'collection',
                  multiplicity: {
                    lowerBound: 1,
                    upperBound: 1,
                  },
                  values: [
                    {
                      _type: 'string',
                      multiplicity: {
                        lowerBound: 1,
                        upperBound: 1,
                      },
                      values: ['Cases'],
                    },
                  ],
                },
              ],
            },
          ],
          parameters: [],
        },
        mapping: 'mapping::CovidDataMapping',
        runtime: {
          _type: 'runtimePointer',
          runtime: 'runtime::H2Runtime',
        },
      },
      name: 'CovidDataSingle',
      owners: ['anonymous', 'akphi'],
      package: 'service',
      pattern: '/9566f101-2108-408f-863f-6d7e154dc17b',
      stereotypes: [],
      taggedValues: [],
    },
  },
  {
    path: 'mapping::CovidDataMapping',
    classifierPath: 'meta::pure::mapping::Mapping',
    content: {
      _type: 'mapping',
      associationMappings: [],
      classMappings: [
        {
          _type: 'relational',
          class: 'domain::Demographics',
          distinct: false,
          groupBy: [],
          mainTable: {
            _type: 'Table',
            database: 'store::CovidDataStore',
            mainTableDb: 'store::CovidDataStore',
            schema: 'default',
            table: 'DEMOGRAPHICS',
          },
          primaryKey: [
            {
              _type: 'column',
              column: 'FIPS',
              table: {
                _type: 'Table',
                database: 'store::CovidDataStore',
                mainTableDb: 'store::CovidDataStore',
                schema: 'default',
                table: 'DEMOGRAPHICS',
              },
              tableAlias: 'DEMOGRAPHICS',
            },
          ],
          propertyMappings: [
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::Demographics',
                property: 'fips',
              },
              relationalOperation: {
                _type: 'column',
                column: 'FIPS',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'DEMOGRAPHICS',
                },
                tableAlias: 'DEMOGRAPHICS',
              },
            },
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::Demographics',
                property: 'state',
              },
              relationalOperation: {
                _type: 'column',
                column: 'STATE',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'DEMOGRAPHICS',
                },
                tableAlias: 'DEMOGRAPHICS',
              },
            },
          ],
          root: false,
        },
        {
          _type: 'relational',
          class: 'domain::COVIDData',
          distinct: false,
          groupBy: [],
          mainTable: {
            _type: 'Table',
            database: 'store::CovidDataStore',
            mainTableDb: 'store::CovidDataStore',
            schema: 'default',
            table: 'COVID_DATA',
          },
          primaryKey: [
            {
              _type: 'column',
              column: 'ID',
              table: {
                _type: 'Table',
                database: 'store::CovidDataStore',
                mainTableDb: 'store::CovidDataStore',
                schema: 'default',
                table: 'COVID_DATA',
              },
              tableAlias: 'COVID_DATA',
            },
          ],
          propertyMappings: [
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::COVIDData',
                property: 'id',
              },
              relationalOperation: {
                _type: 'column',
                column: 'ID',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'COVID_DATA',
                },
                tableAlias: 'COVID_DATA',
              },
            },
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::COVIDData',
                property: 'fips',
              },
              relationalOperation: {
                _type: 'column',
                column: 'FIPS',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'COVID_DATA',
                },
                tableAlias: 'COVID_DATA',
              },
            },
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::COVIDData',
                property: 'date',
              },
              relationalOperation: {
                _type: 'column',
                column: 'DATE',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'COVID_DATA',
                },
                tableAlias: 'COVID_DATA',
              },
            },
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::COVIDData',
                property: 'caseType',
              },
              relationalOperation: {
                _type: 'column',
                column: 'CASE_TYPE',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'COVID_DATA',
                },
                tableAlias: 'COVID_DATA',
              },
            },
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::COVIDData',
                property: 'cases',
              },
              relationalOperation: {
                _type: 'column',
                column: 'CASES',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'COVID_DATA',
                },
                tableAlias: 'COVID_DATA',
              },
            },
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::COVIDData',
                property: 'lastReportedFlag',
              },
              relationalOperation: {
                _type: 'column',
                column: 'LAST_REPORTED_FLAG',
                table: {
                  _type: 'Table',
                  database: 'store::CovidDataStore',
                  mainTableDb: 'store::CovidDataStore',
                  schema: 'default',
                  table: 'COVID_DATA',
                },
                tableAlias: 'COVID_DATA',
              },
            },
            {
              _type: 'relationalPropertyMapping',
              property: {
                class: 'domain::COVIDData',
                property: 'demographics',
              },
              relationalOperation: {
                _type: 'elemtWithJoins',
                joins: [
                  {
                    db: 'store::CovidDataStore',
                    name: 'CovidDataDemographicsJoin',
                  },
                ],
              },
              target: 'domain_Demographics',
            },
          ],
          root: false,
        },
      ],
      enumerationMappings: [],
      includedMappings: [],
      name: 'CovidDataMapping',
      package: 'mapping',
      tests: [],
    },
  },
  {
    path: 'domain::COVIDDatapace2',
    classifierPath: 'meta::pure::metamodel::dataSpace::DataSpace',
    content: {
      _type: 'dataSpace',
      defaultExecutionContext: 'dummyContext',
      description: 'Not over yet?',
      executables: [],
      executionContexts: [
        {
          defaultRuntime: {
            path: 'runtime::H2Runtime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'mapping::CovidDataMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext',
        },
        {
          defaultRuntime: {
            path: 'runtime::H2Runtime',
            type: 'RUNTIME',
          },
          mapping: {
            path: 'mapping::CovidDataMapping',
            type: 'MAPPING',
          },
          name: 'dummyContext2',
        },
      ],
      featuredDiagrams: [
        {
          path: 'domain::COVIDDataDiagram',
          type: 'DIAGRAM',
        },
      ],
      name: 'COVIDDatapace2',
      package: 'domain',
      stereotypes: [],
      taggedValues: [],
      title: 'COVID Sample Data',
    },
  },
];
